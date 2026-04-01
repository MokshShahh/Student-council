from sqlmodel import Session, create_engine, select
import os
from dotenv import load_dotenv
from models import Events

load_dotenv()

postgresql_url = os.getenv("pg_url", "sqlite:///./test.db")
engine = create_engine(postgresql_url)

def check_events():
    with Session(engine) as session:
        events = session.exec(select(Events)).all()
        print(f"Total events: {len(events)}")
        for e in events:
            print(f"Name: {e.name}, Approved: {e.is_approved}")

if __name__ == "__main__":
    check_events()
