from pydantic import BaseModel, EmailStr, Field, ConfigDict, validator
from ...core.validators import validate_email_strict, validate_password_strength, sanitize_string


class UserBase(BaseModel):
    email: EmailStr
    
    @validator('email', pre=True)
    def validate_email(cls, v):
        """Valida formato de email de manera estricta"""
        return validate_email_strict(v)
    
    name: str | None = Field(None, max_length=50)
    
    @validator('name', pre=True)
    def validate_name(cls, v):
        """Sanitiza el nombre del usuario"""
        return sanitize_string(v, max_length=50)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Contraseña con requisitos de seguridad")
    
    @validator('password', pre=True)
    def validate_password(cls, v):
        """Valida fortaleza de la contraseña"""
        return validate_password_strength(v)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str


class UserOut(UserBase):
    id: int
    is_active: bool
    role: str | None = None
    is_verified: bool = False
    model_config = ConfigDict(from_attributes=True)
