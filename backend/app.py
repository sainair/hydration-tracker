from fastapi import FastAPI
from sqlmodel import SQLModel, Field, create_engine
from sqlalchemy import Column, DateTime, func
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

@app.get("/")
def read_root():
    return {"message": "GlassAPI"}