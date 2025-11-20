from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List

from ...core.database import get_db
from ...core.security import decode_access_token
from ...core.exceptions import AuthenticationError, AuthorizationError
from ...core.logging_config import get_logger
from ...models.user import User

logger = get_logger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_db_session():
    for db in get_db():
        yield db


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db_session)
):
    payload = decode_access_token(token)
    if payload is None:
        logger.warning("Token inválido o expirado")
        raise AuthenticationError("No se pudieron validar las credenciales")
    user_id = payload.get("sub")
    if user_id is None:
        logger.warning("Token sin user_id")
        raise AuthenticationError("No se pudieron validar las credenciales")
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        logger.warning(f"Usuario no encontrado: {user_id}")
        raise AuthenticationError("Usuario no encontrado")
    if not user.is_active:
        logger.warning(f"Usuario inactivo: {user_id}")
        raise AuthorizationError("Usuario inactivo")
    return user


def require_roles(allowed_roles: List[str]):
    """Dependency factory para verificar roles"""
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            logger.warning(
                f"Usuario {current_user.id} no tiene rol requerido",
                extra={"user_id": current_user.id, "user_role": current_user.role, "allowed_roles": allowed_roles}
            )
            raise AuthorizationError(f"Requires one of these roles: {', '.join(allowed_roles)}")
        return current_user
    return role_checker


def require_admin(current_user: User = Depends(get_current_user)):
    """Dependency para verificar que el usuario es admin"""
    if current_user.role != "admin":
        logger.warning(f"Usuario {current_user.id} intentó acceder a recurso de admin", extra={"user_id": current_user.id, "user_role": current_user.role})
        raise AuthorizationError("Requires admin role")
    return current_user


def require_verified(current_user: User = Depends(get_current_user)):
    """Dependency para verificar que el email está verificado"""
    if not current_user.is_verified:
        logger.warning(f"Usuario {current_user.id} no tiene email verificado", extra={"user_id": current_user.id})
        raise AuthorizationError("Email verification required")
    return current_user
