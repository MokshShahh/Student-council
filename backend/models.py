from enum import Enum
from sqlmodel import Field, SQLModel
from datetime import datetime


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
