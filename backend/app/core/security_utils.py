"""
Utilidades de seguridad para sanitización y protección de datos sensibles
"""
import re
from typing import Any, Dict, List, Optional


# Patrones de datos sensibles que no deben aparecer en logs
SENSITIVE_PATTERNS = [
    r'password["\']?\s*[:=]\s*["\']?([^"\']+)',
    r'password["\']?\s*[:=]\s*["\']?([^"\']+)',
    r'secret["\']?\s*[:=]\s*["\']?([^"\']+)',
    r'token["\']?\s*[:=]\s*["\']?([^"\']+)',
    r'api[_-]?key["\']?\s*[:=]\s*["\']?([^"\']+)',
    r'authorization["\']?\s*[:=]\s*["\']?bearer\s+([^\s"\']+)',
    r'authorization["\']?\s*[:=]\s*["\']?basic\s+([^\s"\']+)',
    r'credit[_-]?card["\']?\s*[:=]\s*["\']?([^"\']+)',
    r'cvv["\']?\s*[:=]\s*["\']?([^"\']+)',
    r'ssn["\']?\s*[:=]\s*["\']?([^"\']+)',
    r'cif["\']?\s*[:=]\s*["\']?([^"\']+)',
    r'nif["\']?\s*[:=]\s*["\']?([^"\']+)',
]


def sanitize_for_logging(data: Any, max_length: int = 1000) -> Any:
    """
    Sanitiza datos para logging, eliminando información sensible
    
    Args:
        data: Datos a sanitizar (dict, list, str, etc.)
        max_length: Longitud máxima para strings
    
    Returns:
        Datos sanitizados
    """
    if isinstance(data, dict):
        return {k: sanitize_for_logging(v, max_length) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_for_logging(item, max_length) for item in data]
    elif isinstance(data, str):
        return sanitize_string_for_logging(data, max_length)
    elif isinstance(data, bytes):
        return sanitize_string_for_logging(data.decode('utf-8', errors='ignore'), max_length)
    else:
        return data


def sanitize_string_for_logging(text: str, max_length: int = 1000) -> str:
    """
    Sanitiza un string eliminando información sensible
    
    Args:
        text: String a sanitizar
        max_length: Longitud máxima
    
    Returns:
        String sanitizado
    """
    if not isinstance(text, str):
        text = str(text)
    
    # Truncar si es muy largo
    if len(text) > max_length:
        text = text[:max_length] + "... [truncated]"
    
    # Reemplazar patrones sensibles
    sanitized = text
    for pattern in SENSITIVE_PATTERNS:
        sanitized = re.sub(
            pattern,
            lambda m: m.group(0).split('=')[0] + '=***REDACTED***',
            sanitized,
            flags=re.IGNORECASE
        )
    
    return sanitized


def mask_email(email: str) -> str:
    """
    Enmascara un email para logging (ej: user@example.com -> u***@e***.com)
    
    Args:
        email: Email a enmascarar
    
    Returns:
        Email enmascarado
    """
    if not email or '@' not in email:
        return email
    
    parts = email.split('@')
    if len(parts) != 2:
        return email
    
    local, domain = parts
    
    # Enmascarar parte local (mantener primer carácter)
    if len(local) > 1:
        masked_local = local[0] + '*' * (len(local) - 1)
    else:
        masked_local = '*'
    
    # Enmascarar dominio (mantener primer carácter y TLD)
    domain_parts = domain.split('.')
    if len(domain_parts) >= 2:
        masked_domain = domain_parts[0][0] + '*' * (len(domain_parts[0]) - 1) + '.' + '.'.join(domain_parts[1:])
    else:
        masked_domain = '*' * len(domain)
    
    return f"{masked_local}@{masked_domain}"


def mask_phone(phone: str) -> str:
    """
    Enmascara un número de teléfono (ej: 612345678 -> 612***678)
    
    Args:
        phone: Teléfono a enmascarar
    
    Returns:
        Teléfono enmascarado
    """
    if not phone or len(phone) < 4:
        return phone
    
    # Mantener primeros 3 y últimos 3 dígitos
    return phone[:3] + '*' * (len(phone) - 6) + phone[-3:]


def sanitize_dict_for_logging(data: Dict[str, Any], sensitive_keys: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Sanitiza un diccionario eliminando o enmascarando valores sensibles
    
    Args:
        data: Diccionario a sanitizar
        sensitive_keys: Lista de keys sensibles (por defecto: password, secret, token, etc.)
    
    Returns:
        Diccionario sanitizado
    """
    if sensitive_keys is None:
        sensitive_keys = [
            'password', 'hashed_password', 'secret', 'token', 'access_token',
            'refresh_token', 'api_key', 'apikey', 'authorization', 'auth_token',
            'credit_card', 'cvv', 'ssn', 'cif', 'nif', 'certificate_password'
        ]
    
    sanitized = {}
    for key, value in data.items():
        key_lower = key.lower()
        
        # Si la key es sensible, redactar el valor
        if any(sensitive in key_lower for sensitive in sensitive_keys):
            sanitized[key] = '***REDACTED***'
        elif key_lower == 'email' and isinstance(value, str):
            sanitized[key] = mask_email(value)
        elif key_lower in ['phone', 'telephone', 'mobile'] and isinstance(value, str):
            sanitized[key] = mask_phone(value)
        else:
            # Recursivamente sanitizar valores complejos
            sanitized[key] = sanitize_for_logging(value)
    
    return sanitized


def validate_secret_key(secret_key: str) -> bool:
    """
    Valida que una SECRET_KEY tenga la longitud mínima recomendada
    
    Args:
        secret_key: Secret key a validar
    
    Returns:
        True si es válida, False en caso contrario
    """
    if not secret_key or not isinstance(secret_key, str):
        return False
    
    # Mínimo 32 caracteres para seguridad adecuada
    return len(secret_key) >= 32


def generate_secure_random_string(length: int = 32) -> str:
    """
    Genera una cadena aleatoria segura
    
    Args:
        length: Longitud de la cadena
    
    Returns:
        Cadena aleatoria segura
    """
    import secrets
    import string
    
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))



