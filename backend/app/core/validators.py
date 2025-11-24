"""
Validadores personalizados para endpoints críticos
"""
import re
from typing import Optional
from pydantic import validator, ValidationError
from email_validator import validate_email as ve, EmailNotValidError


def validate_email_strict(email: str) -> str:
    """
    Valida formato de email de manera estricta
    
    Raises:
        ValueError: Si el email no es válido
    """
    if not email or not isinstance(email, str):
        raise ValueError("El email es requerido y debe ser una cadena de texto")
    
    email = email.strip().lower()
    
    if len(email) > 254:  # RFC 5321
        raise ValueError("El email no puede exceder 254 caracteres")
    
    # Validación básica de formato
    email_pattern = re.compile(
        r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    )
    if not email_pattern.match(email):
        raise ValueError("Formato de email inválido")
    
    # Validación estricta con email_validator
    try:
        ve(email, check_deliverability=False)
    except EmailNotValidError as e:
        raise ValueError(f"Email inválido: {str(e)}")
    
    return email


def validate_password_strength(password: str) -> str:
    """
    Valida que la contraseña cumpla con requisitos de seguridad
    
    Requisitos:
    - Mínimo 8 caracteres
    - Al menos una letra mayúscula
    - Al menos una letra minúscula
    - Al menos un número
    - Al menos un carácter especial
    
    Raises:
        ValueError: Si la contraseña no cumple los requisitos
    """
    if not password or not isinstance(password, str):
        raise ValueError("La contraseña es requerida")
    
    if len(password) < 8:
        raise ValueError("La contraseña debe tener al menos 8 caracteres")
    
    if len(password) > 128:
        raise ValueError("La contraseña no puede exceder 128 caracteres")
    
    # Verificar requisitos
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password))
    
    errors = []
    if not has_upper:
        errors.append("debe contener al menos una letra mayúscula")
    if not has_lower:
        errors.append("debe contener al menos una letra minúscula")
    if not has_digit:
        errors.append("debe contener al menos un número")
    if not has_special:
        errors.append("debe contener al menos un carácter especial (!@#$%^&*...)")
    
    if errors:
        raise ValueError(f"La contraseña {' y '.join(errors)}")
    
    return password


def validate_spanish_tax_id(tax_id: str) -> str:
    """
    Valida formato de CIF/NIF español
    
    Formatos soportados:
    - NIF: 8 dígitos + 1 letra (ej: 12345678A)
    - CIF: 1 letra + 7 dígitos + 1 carácter (ej: A12345674)
    - NIE: X/Y/Z + 7 dígitos + 1 letra (ej: X1234567L)
    
    Raises:
        ValueError: Si el formato no es válido
    """
    if not tax_id:
        return tax_id
    
    tax_id = tax_id.strip().upper()
    
    # NIF: 8 dígitos + 1 letra
    nif_pattern = re.compile(r'^\d{8}[A-Z]$')
    # CIF: 1 letra + 7 dígitos + 1 carácter (letra o número)
    cif_pattern = re.compile(r'^[A-Z]\d{7}[0-9A-Z]$')
    # NIE: X/Y/Z + 7 dígitos + 1 letra
    nie_pattern = re.compile(r'^[XYZ]\d{7}[A-Z]$')
    
    if nif_pattern.match(tax_id) or cif_pattern.match(tax_id) or nie_pattern.match(tax_id):
        return tax_id
    
    raise ValueError(
        "Formato de CIF/NIF inválido. Debe ser NIF (12345678A), "
        "CIF (A12345674) o NIE (X1234567L)"
    )


def validate_phone_number(phone: Optional[str]) -> Optional[str]:
    """
    Valida formato de número de teléfono español
    
    Formatos aceptados:
    - 9 dígitos (ej: 612345678)
    - Con prefijo +34 (ej: +34612345678)
    - Con espacios/guiones (ej: 612 345 678)
    
    Raises:
        ValueError: Si el formato no es válido
    """
    if not phone:
        return None
    
    # Limpiar espacios y guiones
    phone_clean = re.sub(r'[\s\-]', '', phone.strip())
    
    # Remover prefijo +34 si existe
    if phone_clean.startswith('+34'):
        phone_clean = phone_clean[3:]
    elif phone_clean.startswith('0034'):
        phone_clean = phone_clean[4:]
    
    # Debe tener 9 dígitos
    if not re.match(r'^\d{9}$', phone_clean):
        raise ValueError(
            "Formato de teléfono inválido. Debe tener 9 dígitos "
            "(ej: 612345678 o +34612345678)"
        )
    
    return phone_clean


def validate_postal_code(postal_code: Optional[str]) -> Optional[str]:
    """
    Valida código postal español (5 dígitos)
    
    Raises:
        ValueError: Si el formato no es válido
    """
    if not postal_code:
        return None
    
    postal_code = postal_code.strip()
    
    if not re.match(r'^\d{5}$', postal_code):
        raise ValueError("El código postal debe tener 5 dígitos (ej: 28001)")
    
    # Validar rango válido (01000-52999)
    code_num = int(postal_code)
    if code_num < 1000 or code_num > 52999:
        raise ValueError("El código postal está fuera del rango válido (01000-52999)")
    
    return postal_code


def validate_url(url: Optional[str]) -> Optional[str]:
    """
    Valida formato de URL
    
    Raises:
        ValueError: Si la URL no es válida
    """
    if not url:
        return None
    
    url = url.strip()
    
    # Patrón básico de URL
    url_pattern = re.compile(
        r'^https?://'  # http:// o https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # dominio
        r'localhost|'  # localhost
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # IP
        r'(?::\d+)?'  # puerto opcional
        r'(?:/?|[/?]\S+)$', re.IGNORECASE
    )
    
    if not url_pattern.match(url):
        raise ValueError("Formato de URL inválido. Debe comenzar con http:// o https://")
    
    return url


def sanitize_string(value: Optional[str], max_length: Optional[int] = None) -> Optional[str]:
    """
    Sanitiza una cadena de texto eliminando caracteres peligrosos
    
    Args:
        value: Cadena a sanitizar
        max_length: Longitud máxima permitida
    
    Returns:
        Cadena sanitizada o None si value es None/vacío
    """
    if not value:
        return None
    
    # Eliminar espacios al inicio y final
    value = value.strip()
    
    # Eliminar caracteres de control excepto \n, \r, \t
    value = re.sub(r'[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]', '', value)
    
    # Normalizar espacios múltiples
    value = re.sub(r'\s+', ' ', value)
    
    # Validar longitud máxima
    if max_length and len(value) > max_length:
        raise ValueError(f"El texto no puede exceder {max_length} caracteres")
    
    return value if value else None

