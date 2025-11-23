import re
from pydantic import BaseModel, field_validator, ValidationError
from pydantic_core import PydanticCustomError

class User(BaseModel):
    username: str
    email: str
    password: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, email):
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, email):
            raise PydanticCustomError(
                'invalid_email',
                'Email format is invalid. Please provide a valid email address.'
            )
        return email

class UserLogin(BaseModel):
    username: str  # Pode ser username ou email
    password: str