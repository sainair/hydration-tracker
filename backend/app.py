from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, create_engine, Session, select
from sqlalchemy import Column, DateTime, func, text 
from datetime import datetime
from contextlib import asynccontextmanager
import os

DATABASE_URL = os.environ["DATABASE_URL"]
engine = create_engine(DATABASE_URL, echo=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(lifespan=lifespan)

#CONSTANTS
TIMEZONE = os.environ.get("TIMEZONE", "Asia/Qatar")

#Enable the browser to allow cross origin requests (Communicating between ports 8000 and 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_methods = ["*"],
    allow_headers=["*"]
)

class Habits(SQLModel, table=True):
    id: int | None = Field(default = None, primary_key = True)
    name: str
    target: int
    unit: str

class Entry(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    habit_id: int = Field(foreign_key="habits.id")
    logged_at: datetime | None = Field(default=None, sa_column=Column(DateTime(timezone=True), server_default=func.now(), nullable=False)) #handle timezone conversions
    amount: int = 1

def get_session():                      #creates the session object to be used by endpoints
    with Session(engine) as session:
        yield session

@app.get("/")
def read_root():
    return {"message": "GlassAPI"}

#reading all entries
@app.get("/entries/")
def read_entries(session: Session = Depends(get_session)):
    entries = session.exec(select(Entry)).all()
    return entries

#write into the database with POST
@app.post("/entries/")
def create_entry(session: Session = Depends(get_session)):
    entry = Entry(habit_id=1)       #ID = 1 since we're only focusing on water now
    session.add(entry)              #Make this dynamic for if/when we want to add more habits
    session.commit()
    session.refresh(entry)
    return entry

#Read only entries logged same-day
@app.get("/entries/today")
def read_today(session: Session = Depends(get_session)):
    statement = select(Entry).where(text("logged_at AT TIME ZONE :tz >= (now() AT TIME ZONE :tz)::date").bindparams(tz = TIMEZONE))
    return session.exec(statement).all()

#deleting records
@app.delete("/entries/{entry_id}")
def delete_entry(entry_id: int, session: Session = Depends(get_session)):
    entry = session.get(Entry, entry_id)
    if entry:
        session.delete(entry)
        session.commit()
        return {"ok": True}
    else:
        raise HTTPException(status_code=404, detail="That entry does not exist")