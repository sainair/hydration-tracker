from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import SQLModel, Field, create_engine, Session, select
from sqlalchemy import Column, DateTime, func, text 
from datetime import date, datetime, timedelta, timezone
from contextlib import asynccontextmanager
from pydantic import field_validator
import bcrypt
import os
import jwt
import re
 
DATABASE_URL = os.environ["DATABASE_URL"]
engine = create_engine(DATABASE_URL, echo=True)
 
@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield
 
app = FastAPI(lifespan=lifespan)
 
#CONSTANTS
TIMEZONE = os.environ.get("TIMEZONE", "Asia/Qatar")
SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
OAUTH2_SCHEME = OAuth2PasswordBearer(tokenUrl="auth/login")
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
 
#Enable the browser to allow cross origin requests (Communicating between ports 8000 and 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins = ALLOWED_ORIGINS,
    allow_methods = ["*"],
    allow_headers=["*"]
)
 
#TABLES
class Habits(SQLModel, table=True):
    id: int | None = Field(default = None, primary_key = True)
    user_id: int = Field(foreign_key="users.id", ondelete="CASCADE", index=True)
    name: str
    target: int
    unit: str
 
class Entry(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    habit_id: int = Field(foreign_key="habits.id", ondelete="CASCADE")
    logged_at: datetime | None = Field(default=None, sa_column=Column(DateTime(timezone=True), server_default=func.now(), nullable=False)) #handle timezone conversions
    amount: int = 1
 
class Users(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    password_hash: str
    created_at: datetime | None = Field(default=None, sa_column=Column(DateTime(timezone=True), server_default=func.now(), nullable=False))
 
#Request/response Models
class UserCreate(SQLModel):
    username: str
    password: str
 
    @field_validator("username")
    @classmethod
    def verify_username(cls, v: str) -> str:
        v = v.strip()
        if not re.fullmatch(r"[a-zA-Z0-9_]{3,20}", v):
            raise HTTPException(status_code=422, detail="Username must be between 3 and 20 characters with only letters, numbers and _")
        return v.lower()
 
    @field_validator("password")
    @classmethod
    def verify_password_rules(cls, p: str) -> str:
        if len(p) < 8:
            raise HTTPException(status_code=422, detail="Password must be at least 8 characters")
        if len(p.encode()) > 72:
            raise HTTPException(status_code=422, detail="Password is too long")
        if not re.search(r"[a-z]", p):
            raise HTTPException(status_code=422, detail="Password must contain a lowercase letter")
        if not re.search(r"[A-Z]", p):
            raise HTTPException(status_code=422, detail="Password must contain an uppercase letter")
        if not re.search(r"[!@#$%^&*()_+=-]", p):
            raise HTTPException(status_code=422, detail="Password must contain a special character")
        return p
 
class UserLogin(SQLModel):
    username: str
    password: str
 
    @field_validator("username")
    @classmethod
    def normalise_username(cls, v: str) -> str:
        return v.strip().lower()
 
class UserRead(SQLModel):
    id: int
    username: str
    created_at: datetime
 
class DayTotal(SQLModel):
    day: date
    total: int
 
#Helper Functions
def hash_password(password: str):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
 
def verify_password(entered: str, actual: str) -> bool:
    return bcrypt.checkpw(entered.encode(), actual.encode())
 
def create_access_token(user_id):
    access_token_draft = {
        "sub": str(user_id),
        "exp": (datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    }
 
    access_token = jwt.encode(access_token_draft, SECRET_KEY, algorithm=ALGORITHM)
    return access_token
 
def get_session():                      #creates the session object to be used by endpoints
    with Session(engine) as session:
        yield session
 
def get_current_user(
        token: str = Depends(OAUTH2_SCHEME),
        session: Session = Depends(get_session)
) -> Users:
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id = int(decoded_token['sub'])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Expired or tampered token")
    
    user = session.exec(select(Users).where(Users.id == id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="Expired or tampered token")
    return user
 
#API ENDPOINTS
@app.get("/")
def read_root():
    return {"message": "GlassAPI"}
 
@app.post("/users/", response_model=UserRead)
def create_user(data: UserCreate, session: Session = Depends(get_session)):
    statement=select(Users).where(Users.username == data.username)
    if session.exec(statement).first():
        raise HTTPException(status_code=409, detail="That username is taken")
    
    pwd = hash_password(data.password)
    user = Users(username=data.username, password_hash=pwd)
    #Populating the users table
    session.add(user)
    session.commit()
    session.refresh(user)
 
    #Populating the habits table to default to a habit of water tracking for now, might change later
    habit = Habits(user_id=user.id, name="Water", target=7, unit="cups") #Defaulting to 7 til target inputting is implemented
    session.add(habit)
    session.commit()
 
    return user
 
#reading all entries
@app.get("/entries/")
def read_entries(session: Session = Depends(get_session), user: Users = Depends(get_current_user)):
    entries = session.exec(select(Entry).join(Habits).where(Habits.user_id == user.id)).all()
    return entries
 
#write into the database with POST
@app.post("/entries/")
def create_entry(session: Session = Depends(get_session), user: Users = Depends(get_current_user)):
    habit = session.exec(select(Habits).where(Habits.user_id == user.id)).first()
    if not habit:
        raise HTTPException(status_code=404, detail="That habit doesn't exist")
    entry=Entry(habit_id=habit.id)  #made dynamic from previous edit
    session.add(entry)            
    session.commit()
    session.refresh(entry)
    return entry
 
#Read only entries logged same-day
@app.get("/entries/today")
def read_today(session: Session = Depends(get_session), user: Users = Depends(get_current_user)):
    statement = (
        select(Entry)
        .join(Habits)
        .where(Habits.user_id == user.id)
        .where(text("logged_at AT TIME ZONE :tz >= (now() AT TIME ZONE :tz)::date")
        .bindparams(tz = TIMEZONE))
    )
    return session.exec(statement).all()
 
@app.get("/history/")
def read_history(days: int = 5, session: Session = Depends(get_session), user: Users = Depends(get_current_user)):
    rows = session.connection().execute(text("""
        SELECT (logged_at AT TIME ZONE :tz)::date AS day,
            SUM(amount) AS total
        FROM entry
        JOIN habits ON entry.habit_id = habits.id
        WHERE habits.user_id = :user_id
        GROUP BY day
        ORDER BY day DESC
        LIMIT :days
    """), {"tz": TIMEZONE, "user_id": user.id, "days": days}).all()
 
    return [DayTotal(day=r.day, total=r.total) for r in rows]
 
 
#deleting records
@app.delete("/entries/{entry_id}")
def delete_entry(entry_id: int, session: Session = Depends(get_session), user: Users = Depends(get_current_user)):
    entry = session.exec(select(Entry).join(Habits).where(Entry.id == entry_id, Habits.user_id == user.id)).first()
    if entry:
        session.delete(entry)
        session.commit()
        return {"ok": True}
    else:
        raise HTTPException(status_code=404, detail="That entry does not exist")
    
@app.post("/auth/login")
def login(data: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(select(Users).where(data.username == Users.username)).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect username or password entered")
    
    access_token = create_access_token(user.id)
    return {"access_token": access_token, "token_type": "bearer"}
