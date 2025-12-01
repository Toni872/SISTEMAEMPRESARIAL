from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from .config import settings
from typing import List


conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=settings.USE_CREDENTIALS,
    VALIDATE_CERTS=settings.VALIDATE_CERTS,
)

fastmail = FastMail(conf)


async def send_verification_email(email: str, token: str, name: str | None = None):
    """Envía email de verificación"""
    if not settings.MAIL_USERNAME or not settings.MAIL_PASSWORD:
        # En desarrollo, solo loguear
        from .logging_config import get_logger
        logger = get_logger(__name__)
        logger.debug(f"Verification token generated for {email}")
        return
    
    verification_url = f"http://localhost:3001/verify-email?token={token}"
    
    message = MessageSchema(
        subject="Verifica tu cuenta - ERP Sistema",
        recipients=[email],
        body=f"""
        Hola {name or 'Usuario'},
        
        Gracias por registrarte en ERP Sistema. Por favor verifica tu cuenta haciendo clic en el siguiente enlace:
        
        {verification_url}
        
        Este enlace expirará en 24 horas.
        
        Si no creaste esta cuenta, puedes ignorar este email.
        
        Saludos,
        Equipo ERP Sistema
        """,
        subtype="plain"
    )
    
    try:
        await fastmail.send_message(message)
    except Exception as e:
        from .logging_config import get_logger
        logger = get_logger(__name__)
        logger.error(f"Error sending email: {e}", exc_info=True)
        # En desarrollo, no fallar si el email no está configurado


async def send_password_reset_email(email: str, token: str, name: str | None = None):
    """Envía email de recuperación de contraseña"""
    if not settings.MAIL_USERNAME or not settings.MAIL_PASSWORD:
        from .logging_config import get_logger
        logger = get_logger(__name__)
        logger.debug(f"Password reset token generated for {email}")
        return
    
    reset_url = f"http://localhost:3001/reset-password?token={token}"
    
    message = MessageSchema(
        subject="Recuperación de contraseña - ERP Sistema",
        recipients=[email],
        body=f"""
        Hola {name or 'Usuario'},
        
        Has solicitado recuperar tu contraseña. Haz clic en el siguiente enlace:
        
        {reset_url}
        
        Este enlace expirará en 1 hora.
        
        Si no solicitaste esto, ignora este email.
        
        Saludos,
        Equipo ERP Sistema
        """,
        subtype="plain"
    )
    
    try:
        await fastmail.send_message(message)
    except Exception as e:
        from .logging_config import get_logger
        logger = get_logger(__name__)
        logger.error(f"Error sending email: {e}", exc_info=True)

