from sqlalchemy.orm import Session
from datetime import datetime
from ..models.user import User
from ..api.auth.schemas import UserCreate


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def create_user(
    db: Session, 
    user: UserCreate, 
    hashed_password: str,
    verification_token: str | None = None,
    token_expires: datetime | None = None,
    role: str = "user"
):
    db_user = User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password,
        role=role,
        is_verified=False,
        verification_token=verification_token,
        verification_token_expires=token_expires
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user_refresh_token(db: Session, user_id: int, refresh_token: str | None):
    """Actualizar refresh token del usuario"""
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.refresh_token = refresh_token
        db.commit()
        db.refresh(user)
    return user


def verify_user_email(db: Session, user_id: int):
    """Marcar email como verificado"""
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.is_verified = True
        user.verification_token = None
        user.verification_token_expires = None
        db.commit()
        db.refresh(user)
    return user

