from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserBase(BaseModel):
    email: EmailStr
    name: str | None = Field(None, max_length=50)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


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
