from fastapi import APIRouter, Depends, status, HTTPException, Form
from starlette.requests import Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from slowapi import Limiter
from slowapi.util import get_remote_address

from ...crud.user import get_user_by_email, create_user, update_user_refresh_token, verify_user_email
from ...core.security import (
    get_password_hash, 
    verify_password, 
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    generate_verification_token
)
from ...core.email import send_verification_email
from ...core.rate_limit import limiter, conditional_rate_limit
from ...core.exceptions import (
    AuthenticationError,
    AuthorizationError,
    BusinessLogicError,
    ValidationError,
    ConflictError
)
from ...core.logging_config import get_logger
from ...api.auth.schemas import UserCreate, Token, UserOut, TokenRefresh
from ...api.auth.deps import get_db_session, get_current_user
from ...models.user import User

logger = get_logger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
@conditional_rate_limit("10/minute")
async def register(
    user_in: UserCreate,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Registrar nuevo usuario y enviar email de verificación"""
    if existing := get_user_by_email(db, user_in.email):
        logger.warning(
            f"Intento de registro con email ya existente: {user_in.email}",
            extra={"email": user_in.email}
        )
        raise ConflictError("El email ya está registrado", error_code="EMAIL_ALREADY_REGISTERED")
    
    hashed_pw = get_password_hash(user_in.password)
    verification_token = generate_verification_token()
    token_expires = datetime.utcnow() + timedelta(days=1)
    
    db_user = create_user(
        db, 
        user_in, 
        hashed_pw,
        verification_token=verification_token,
        token_expires=token_expires
    )
    
    # Enviar email de verificación (async)
    await send_verification_email(db_user.email, verification_token, db_user.name)
    
    return {
        "id": db_user.id,
        "email": db_user.email,
        "name": db_user.name,
        "is_active": db_user.is_active,
        "role": db_user.role,
        "is_verified": db_user.is_verified
    }


@router.post(
    "/login",
    response_model=Token,
    summary="Iniciar sesión",
    description="""
    Autentica un usuario y retorna tokens de acceso y refresco.
    
    **Limitaciones:**
    - Máximo 5 intentos de login por minuto por IP
    
    **Respuestas:**
    - `200`: Login exitoso, retorna tokens
    - `401`: Credenciales incorrectas
    - `403`: Cuenta inactiva
    
    **Ejemplo de uso:**
    ```python
    import requests
    
    response = requests.post(
        "/api/auth/login",
        data={
            "username": "usuario@example.com",
            "password": "contraseña123"
        }
    )
    tokens = response.json()
    # Usar tokens["access_token"] en headers: Authorization: Bearer <token>
    ```
    """
)
@conditional_rate_limit("5/minute")
async def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db_session)
):
    """Login con OAuth2PasswordRequestForm - retorna access_token y refresh_token"""
    user = get_user_by_email(db, form_data.username)  # OAuth2 usa 'username' para email
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        logger.warning(
            f"Intento de login fallido: {form_data.username}",
            extra={"email": form_data.username}
        )
        raise AuthenticationError("Email o contraseña incorrectos")
    
    if not user.is_active:
        logger.warning(
            f"Intento de login con cuenta inactiva: {user.email}",
            extra={"user_id": user.id}
        )
        raise AuthorizationError("La cuenta de usuario está inactiva")
    
    # Crear tokens
    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    
    # Guardar refresh token en BD
    update_user_refresh_token(db, user.id, refresh_token)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(
    token_data: TokenRefresh,
    db: Session = Depends(get_db_session)
):
    """Refrescar access token usando refresh token"""
    payload = decode_refresh_token(token_data.refresh_token)
    
    if not payload:
        logger.warning("Intento de refresh con token inválido")
        raise AuthenticationError("Token de refresco inválido")
    
    user_id = payload.get("sub")
    if not user_id:
        logger.warning("Token de refresco sin payload válido")
        raise AuthenticationError("Payload del token inválido")
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user or not user.is_active:
        logger.warning(
            f"Usuario no encontrado o inactivo para refresh: {user_id}",
            extra={"user_id": user_id}
        )
        raise AuthenticationError("Usuario no encontrado o inactivo")
    
    # Verificar que el refresh token coincide con el almacenado
    if user.refresh_token != token_data.refresh_token:
        logger.warning(
            f"Refresh token no coincide para usuario: {user.id}",
            extra={"user_id": user.id}
        )
        raise AuthenticationError("El token de refresco no coincide")
    
    # Generar nuevos tokens
    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    
    # Actualizar refresh token en BD
    update_user_refresh_token(db, user.id, refresh_token)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/verify-email")
async def verify_email(
    token: str = Form(...),
    db: Session = Depends(get_db_session)
):
    """Verificar email usando token"""
    user = db.query(User).filter(
        User.verification_token == token,
        User.verification_token_expires > datetime.utcnow()
    ).first()
    
    if not user:
        logger.warning("Intento de verificación con token inválido o expirado")
        raise ValidationError("Token de verificación inválido o expirado")
    
    verify_user_email(db, user.id)
    
    return {"message": "Email verified successfully"}


@router.post("/resend-verification")
@limiter.limit("3/minute")
async def resend_verification(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Reenviar email de verificación"""
    if current_user.is_verified:
        logger.info(
            f"Intento de reenvío de verificación para email ya verificado: {current_user.email}",
            extra={"user_id": current_user.id}
        )
        raise BusinessLogicError("El email ya está verificado")
    
    verification_token = generate_verification_token()
    token_expires = datetime.utcnow() + timedelta(days=1)
    
    current_user.verification_token = verification_token
    current_user.verification_token_expires = token_expires
    db.commit()
    
    await send_verification_email(current_user.email, verification_token, current_user.name)
    
    return {"message": "Verification email sent"}


@router.get("/me", response_model=UserOut)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Obtener información del usuario autenticado"""
    return current_user


@router.post("/logout")
def logout(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Cerrar sesión - invalidar refresh token"""
    update_user_refresh_token(db, current_user.id, None)
    return {"message": "Logged out successfully"}
