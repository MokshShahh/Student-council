from fastapi import FastAPI, HTTPException, Depends, status
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from typing import Annotated
from sqlmodel import Session, SQLModel, create_engine, select
import os
from models import *
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pydantic import BaseModel
import jwt


load_dotenv()

SECRET_KEY = os.getenv("jwt_secret") | "no secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None
    role: str 


postgresql_url = os.getenv("pg_url","env error")
engine = create_engine(postgresql_url, echo=True)
password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

#for db session
def get_session():
    with Session(engine) as session:
        yield session

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

def get_password_hash(password):
    return password_hash.hash(password)

def authenticate_user(session: Session, email: str, password: str):
    user = get_user(email, session)
    if not user:
        verify_password(password, get_password_hash(password))
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")
        role = payload.get("role")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(email, Session)
    if user is None:
        raise credentials_exception
    return user


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_user(email: str, session: Session):
    statement = select(User).where(User.email == email)
    results = session.exec(statement)
    return results.first()


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

from fastapi import FastAPI, HTTPException, Depends, status
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from typing import Annotated
from sqlmodel import Session, SQLModel, create_engine, select
import os
from models import *
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pydantic import BaseModel
import jwt


load_dotenv()

SECRET_KEY = os.getenv("jwt_secret") | "no secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None
    role: str 


postgresql_url = os.getenv("pg_url","env error")
engine = create_engine(postgresql_url, echo=True)
password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

#for db session
def get_session():
    with Session(engine) as session:
        yield session

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

def get_password_hash(password):
    return password_hash.hash(password)

def authenticate_user(session: Session, email: str, password: str):
    user = get_user(email, session)
    if not user:
        verify_password(password, get_password_hash(password))
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Annotated[Session, Depends(get_session)]
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        role: str = payload.get("role")
        
        if email is None or role is None:
            raise credentials_exception
            
        token_data = TokenData(email=email, role=role)
    except (InvalidTokenError, KeyError):
        raise credentials_exception
        
    user = get_user(token_data.email, session)
    if user is None:
        raise credentials_exception
    return user


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_user(email: str, session: Session):
    statement = select(User).where(User.email == email)
    results = session.exec(statement)
    return results.first()


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

@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Annotated[Session, Depends(get_session)]
) -> Token:
    user = authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"email": user.email, "role": user.role}, 
        expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")