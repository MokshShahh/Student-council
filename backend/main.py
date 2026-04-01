from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from typing import Annotated, List
from sqlmodel import Session, SQLModel, create_engine, select
import os
from models import *
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pydantic import BaseModel
import jwt

load_dotenv()

SECRET_KEY = os.getenv("jwt_secret") or "no secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None
    role: str | None = None

postgresql_url = os.getenv("pg_url", "sqlite:///./test.db")
engine = create_engine(postgresql_url, echo=True)
password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# for db session
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
        # Prevent timing attacks
        password_hash.hash(password)
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
    except Exception:
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

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    # Only use this during development to sync schema changes
    # SQLModel.metadata.drop_all(engine) 
    create_db_and_tables()

@app.get("/")
async def root():
    return {"message": "Hello World"}

class UserRegister(BaseModel):
    email: str
    password: str
    role: UserRole = UserRole.STUDENT

@app.post("/register")
async def register_user(
    user_data: UserRegister,
    session: Annotated[Session, Depends(get_session)]
):
    existing_user = get_user(user_data.email, session)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already registered"
        )
    
    new_user = User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        role=user_data.role
    )
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return {"message": "User registered successfully"}

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

@app.get("/api/events")
async def get_events(session: Annotated[Session, Depends(get_session)]):
    statement = select(Events)
    results = session.exec(statement)
    return results.all()

@app.patch("/api/events/{event_id}/approve")
async def approve_event(
    event_id: int,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    event = session.get(Events, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event.is_approved = True
    session.add(event)
    session.commit()
    session.refresh(event)
    return event

@app.post("/api/events")
async def add_event(
    event: Events,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    session.add(event)
    session.commit()
    session.refresh(event)
    return event
