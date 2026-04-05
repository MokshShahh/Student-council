from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from typing import Annotated, List, Optional
from sqlmodel import Session, SQLModel, create_engine, select
import os
import shutil
import uuid
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
UPLOAD_DIR = "uploads" # Local to backend dir

# Ensure upload directory exists
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None
    role: str | None = None
    committee_id: int | None = None

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
        committee_id: int | None = payload.get("committee_id")
        
        if email is None or role is None:
            raise credentials_exception
            
        token_data = TokenData(email=email, role=role, committee_id=committee_id)
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

# Serve static files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.on_event("startup")
def on_startup():
    # Force schema recreation to add new columns (remove this line after one successful run)
    # SQLModel.metadata.drop_all(engine)
    create_db_and_tables()

@app.get("/")
async def root():
    return {"message": "Hello World"}

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str | None = None
    phone: str | None = None
    role: UserRole = UserRole.STUDENT

@app.post("/register")
async def register_user(
    session: Annotated[Session, Depends(get_session)],
    email: str = Form(...),
    password: str = Form(...),
    full_name: str = Form(None),
    phone: str = Form(None),
    role: str = Form("student"),
    committee_name: str = Form(None),
    logo: UploadFile = File(None)
):
    existing_user = get_user(email, session)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already registered"
        )
    
    committee_id = None
    if role == "committee":
        if not committee_name:
             raise HTTPException(status_code=400, detail="Committee name is required")
        
        # Check if committee exists
        stmt = select(Committee).where(Committee.name == committee_name)
        if session.exec(stmt).first():
             raise HTTPException(status_code=400, detail="Committee name already exists")
        
        logo_url = None
        if logo:
            filename = f"{uuid.uuid4()}_{logo.filename}"
            file_path = os.path.join(UPLOAD_DIR, filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(logo.file, buffer)
            logo_url = f"http://localhost:8000/uploads/{filename}"
        
        new_committee = Committee(name=committee_name, logo_url=logo_url)
        session.add(new_committee)
        session.commit()
        session.refresh(new_committee)
        committee_id = new_committee.id

    new_user = User(
        email=email,
        hashed_password=get_password_hash(password),
        full_name=full_name,
        phone=phone,
        role=role,
        committee_id=committee_id
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
    token_data = {"email": user.email, "role": user.role}
    if user.committee_id:
        token_data["committee_id"] = user.committee_id
        
    access_token = create_access_token(
        data=token_data, 
        expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

@app.get("/api/events")
async def get_events(session: Annotated[Session, Depends(get_session)]):
    statement = select(Events).where(Events.is_approved == True)
    results = session.exec(statement)
    return results.all()

@app.get("/api/admin/events/pending")
async def get_pending_events(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    statement = select(Events).where(Events.is_approved == False)
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
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
    name: str = Form(...),
    description: Optional[str] = Form(None),
    registration_link: Optional[str] = Form(None),
    start_time: Optional[datetime] = Form(None),
    end_time: Optional[datetime] = Form(None),
    banner: UploadFile = File(None)
):
    if current_user.role != UserRole.COMMITTEE and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to create events")
    
    banner_url = None
    if banner:
        filename = f"{uuid.uuid4()}_{banner.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(banner.file, buffer)
        banner_url = f"http://localhost:8000/uploads/{filename}"
    
    new_event = Events(
        name=name,
        description=description,
        registration_link=registration_link,
        start_time=start_time,
        end_time=end_time,
        banner=banner_url,
        is_approved=False
    )
    
    if current_user.role == UserRole.COMMITTEE:
        if not current_user.committee_id:
            raise HTTPException(status_code=400, detail="Committee profile not set up")
        new_event.committee_id = current_user.committee_id
    else:
        new_event.is_approved = True
        
    session.add(new_event)
    session.commit()
    session.refresh(new_event)
    return new_event

@app.post("/api/events/{event_id}/register")
async def register_for_event(
    event_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    # Fix for EventRegistration model reference
    statement = select(EventRegistration).where(
        EventRegistration.user_id == current_user.id,
        EventRegistration.event_id == event_id
    )
    existing = session.exec(statement).first()
    if existing:
        return {"message": "Already registered"}
    
    registration = EventRegistration(user_id=current_user.id, event_id=event_id)
    session.add(registration)
    session.commit()
    return {"message": "Registered successfully"}

@app.get("/api/events/me")
async def get_my_events(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    # Added join fix
    statement = select(Events).join(EventRegistration).where(EventRegistration.user_id == current_user.id)
    results = session.exec(statement)
    return results.all()

@app.get("/api/committees")
async def get_committees(session: Annotated[Session, Depends(get_session)]):
    statement = select(Committee)
    results = session.exec(statement)
    return results.all()

@app.post("/api/committees/{committee_id}/apply")
async def apply_to_committee(
    committee_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    # Check if already applied
    stmt = select(CommitteeApplication).where(
        CommitteeApplication.user_id == current_user.id,
        CommitteeApplication.committee_id == committee_id
    )
    if session.exec(stmt).first():
        raise HTTPException(status_code=400, detail="Already applied to this committee")
    
    app = CommitteeApplication(user_id=current_user.id, committee_id=committee_id)
    session.add(app)
    session.commit()
    return {"message": "Application submitted"}

@app.get("/api/applications/me")
async def get_my_applications(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    stmt = select(CommitteeApplication, Committee.name).join(Committee).where(
        CommitteeApplication.user_id == current_user.id
    )
    results = session.exec(stmt).all()
    
    apps = []
    for application, committee_name in results:
        d = application.dict()
        d["committee_name"] = committee_name
        apps.append(d)
    return apps

@app.get("/api/committee/applications")
async def get_committee_applications(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    if current_user.role != UserRole.COMMITTEE or not current_user.committee_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Select applications joined with user info
    stmt = select(CommitteeApplication, User.full_name, User.email).join(User).where(
        CommitteeApplication.committee_id == current_user.committee_id
    )
    results = session.exec(stmt).all()
    
    apps = []
    for application, name, email in results:
        d = application.dict()
        d["user_name"] = name
        d["user_email"] = email
        apps.append(d)
    return apps

@app.patch("/api/committee/applications/{app_id}")
async def update_application_status(
    app_id: int,
    new_status: str,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    application = session.get(CommitteeApplication, app_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if current_user.role != UserRole.COMMITTEE or application.committee_id != current_user.committee_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if new_status not in ["Accepted", "Rejected", "Pending"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    application.status = new_status
    session.add(application)
    session.commit()
    return application

@app.get("/api/committee/profile/me")
async def get_my_committee_profile(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    if current_user.role != UserRole.COMMITTEE:
        raise HTTPException(status_code=403, detail="Not a committee user")
    if not current_user.committee_id:
        return None
    committee = session.get(Committee, current_user.committee_id)
    return committee

@app.post("/api/committee/profile")
async def setup_committee_profile(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
    name: str = Form(...),
    description: Optional[str] = Form(None),
    long_description: Optional[str] = Form(None),
    contact_info: Optional[str] = Form(None),
    instagram: Optional[str] = Form(None),
    linkedin: Optional[str] = Form(None),
    twitter: Optional[str] = Form(None),
    logo: UploadFile = File(None)
):
    if current_user.role != UserRole.COMMITTEE:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    logo_url = None
    if logo:
        filename = f"{uuid.uuid4()}_{logo.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(logo.file, buffer)
        logo_url = f"http://localhost:8000/uploads/{filename}"
    
    if current_user.committee_id:
        db_committee = session.get(Committee, current_user.committee_id)
        db_committee.name = name
        db_committee.description = description
        db_committee.long_description = long_description
        if logo_url:
            db_committee.logo_url = logo_url
        db_committee.contact_info = contact_info
        db_committee.instagram = instagram
        db_committee.linkedin = linkedin
        db_committee.twitter = twitter
        session.add(db_committee)
    else:
        new_committee = Committee(
            name=name,
            description=description,
            long_description=long_description,
            logo_url=logo_url,
            contact_info=contact_info,
            instagram=instagram,
            linkedin=linkedin,
            twitter=twitter
        )
        session.add(new_committee)
        session.commit()
        session.refresh(new_committee)
        current_user.committee_id = new_committee.id
        session.add(current_user)
        
    session.commit()
    return {"message": "Profile updated successfully"}

@app.get("/api/committees/{committee_id}/public")
async def get_public_committee_detail(
    committee_id: int,
    session: Annotated[Session, Depends(get_session)]
):
    committee = session.get(Committee, committee_id)
    if not committee:
        raise HTTPException(status_code=404, detail="Committee not found")
    
    # Get approved events
    stmt_events = select(Events).where(Events.committee_id == committee_id, Events.is_approved == True)
    events = session.exec(stmt_events).all()
    
    # Get news
    stmt_news = select(News).where(News.committee_id == committee_id).order_by(News.created_at.desc())
    news = session.exec(stmt_news).all()
    
    return {
        "committee": committee,
        "events": events,
        "news": news
    }

@app.get("/api/committee/dashboard/events")
async def get_committee_events(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    if current_user.role != UserRole.COMMITTEE or not current_user.committee_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    statement = select(Events).where(Events.committee_id == current_user.committee_id)
    results = session.exec(statement)
    return results.all()

@app.get("/api/news")
async def get_all_news(session: Annotated[Session, Depends(get_session)]):
    statement = select(News, Committee.name).join(Committee).order_by(News.created_at.desc())
    results = session.exec(statement).all()
    news_list = []
    for news, committee_name in results:
        news_dict = news.dict()
        news_dict["committee_name"] = committee_name
        news_list.append(news_dict)
    return news_list

@app.get("/api/committee/news")
async def get_committee_news(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    if current_user.role != UserRole.COMMITTEE or not current_user.committee_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    statement = select(News).where(News.committee_id == current_user.committee_id).order_by(News.created_at.desc())
    results = session.exec(statement)
    return results.all()

@app.post("/api/news")
async def create_news(
    news_data: dict,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    if current_user.role != UserRole.COMMITTEE or not current_user.committee_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    new_news = News(
        committee_id=current_user.committee_id,
        title=news_data.get("title"),
        content=news_data.get("content")
    )
    session.add(new_news)
    session.commit()
    session.refresh(new_news)
    return new_news

@app.delete("/api/news/{news_id}")
async def delete_news(
    news_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    news = session.get(News, news_id)
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    if news.committee_id != current_user.committee_id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    session.delete(news)
    session.commit()
    return {"message": "News deleted"}
