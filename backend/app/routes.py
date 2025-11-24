from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.depends import get_db_session, get_current_user
from app.auth_user import UserUseCases
from app.schemas import User, UserLogin

router = APIRouter(prefix="/users")

@router.post("/register")
def register_user(user: User, db_session: Session = Depends(get_db_session)):
    uc = UserUseCases(db_session=db_session)
    uc.user_register(user=user)
    return JSONResponse(
        content={"message": "User registered successfully"},
        status_code=status.HTTP_201_CREATED
    )

@router.post("/login")
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db_session: Session = Depends(get_db_session)):
    uc = UserUseCases(db_session=db_session)
    user_login = UserLogin(username=form_data.username, password=form_data.password)
    token_data = uc.user_login(user=user_login)
    return token_data

@router.get("/me")
def get_me(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }