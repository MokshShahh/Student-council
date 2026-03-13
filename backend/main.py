from fastapi import FastAPI
from dotenv import load_dotenv
from datetime import datetime
from typing import Annotated
from sqlmodel import Field, Session, SQLModel, create_engine, select
import os
from enum import Enum


load_dotenv()

class UserRole(str, Enum):
    STUDENT = "student"
    COMMITTEE = "committee"
    ADMIN = "admin"

class Committee(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    description: str | None = None

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    role: UserRole = Field(default=UserRole.STUDENT)
    committee_id: int | None = Field(default=None, foreign_key="committee.id")
    is_verified: bool = Field(default=False)

class Events(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    committee_id: int = Field(foreign_key="committee.id")
    name: str = Field(index=True)
    description: str | None = Field(default=None)
    registration_link: str | None = None
    banner: str | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None
    is_approved: bool = Field(default=False)

postgresql_url = os.getenv("pg_url","env error")

engine = create_engine(postgresql_url, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def create_event(name : str, description : str, registration_link : str, banner : str, start_time : datetime, end_time : datetime, committee_id : int ):
    data = locals()

    #unpacking dict
    event=Events(**data)    
    with Session(engine) as session:
        session.add(event)
        session.commit()
        session.refresh(event)
        print("Created event:", event)

if __name__ == "__main__":
    create_db_and_tables()

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}