from datetime import datetime, timedelta
from fastapi import status
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.db.models import UserModel
from app.schemas import User, UserLogin
import bcrypt
from jose import jwt, JWTError
from decouple import config

SECRET_KEY = config("SECRET_KEY")
ALGORITHM = config("ALGORITHM")

class UserUseCases:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def user_register(self, user: User):
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
        user_model = UserModel(
            username=user.username,
            email=user.email,
            password=hashed_password.decode('utf-8')
        )
        try:
            self.db_session.add(user_model)
            self.db_session.commit()
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already exists"
            )
        return user_model   
    
    def user_login(self, user: UserLogin, expires_in: int = 3600):
        user_on_db = self.db_session.query(UserModel).filter(
            (UserModel.username == user.username) | (UserModel.email == user.username)
        ).first()

        if user_on_db is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        
        if not bcrypt.checkpw(user.password.encode('utf-8'), user_on_db.password.encode('utf-8')):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        
        exp = datetime.utcnow() + timedelta(seconds=expires_in)

        payload = {
            "sub": user_on_db.username,
            "exp": exp
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return {
            "access_token": token,
            "token_type": "bearer",
            "expires_in": expires_in
        }