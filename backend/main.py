from fastapi import FastAPI
from dotenv import load_dotenv
from datetime import datetime
from typing import Annotated
from sqlmodel import Session, SQLModel, create_engine, select
import os
from models import *


load_dotenv()


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