from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from ...crud.user import get_user_by_email, create_user
from ...core.security import get_password_hash, verify_password, create_access_token
from ...api.auth.schemas import UserCreate, UserLogin, Token, UserOut
from ...api.auth.deps import get_db_session, get_current_user
from ...models.user import User

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db_session)):
    if existing := get_user_by_email(db, user_in.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        )
    hashed_pw = get_password_hash(user_in.password)
    db_user = create_user(db, user_in, hashed_pw)
    return {"id": db_user.id, "email": db_user.email, "name": db_user.name}


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db_session)):
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Login attempt for email: {credentials.email}")
    
    user = get_user_by_email(db, credentials.email)
    if not user:
        logger.warning(f"User not found: {credentials.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    password_match = verify_password(credentials.password, user.hashed_password)
    logger.info(f"Password match for {credentials.email}: {password_match}")
    
    if not password_match:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Obtener información del usuario autenticado"""
    return current_user
