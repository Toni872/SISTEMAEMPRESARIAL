"""
Gestor de Certificados Electrónicos para Verifactu/AEAT
Maneja la carga, validación y uso de certificados electrónicos
"""
import os
from pathlib import Path
from typing import Optional, Dict, Any
from datetime import datetime
import base64
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization


class CertificateManager:
    """Gestor de certificados electrónicos"""
    
    def __init__(self, certificates_dir: Optional[str] = None):
        """
        Inicializa el gestor de certificados
        
        Args:
            certificates_dir: Directorio donde se almacenan los certificados
        """
        # Importar settings aquí para evitar importación circular
        try:
            from ..core.config import settings
            default_dir = settings.VERIFACTU_CERTIFICATES_DIR
        except:
            default_dir = "certificates"
        
        if certificates_dir:
            self.certificates_dir = Path(certificates_dir)
        else:
            # Directorio desde configuración o por defecto
            if Path(default_dir).is_absolute():
                self.certificates_dir = Path(default_dir)
            else:
                # Directorio relativo: backend/certificates
                self.certificates_dir = Path(__file__).parent.parent.parent / default_dir
        
        # Crear directorio si no existe
        self.certificates_dir.mkdir(parents=True, exist_ok=True)
    
    def validate_certificate(self, certificate_path: str, password: Optional[str] = None) -> Dict[str, Any]:
        """
        Valida un certificado electrónico
        
        Args:
            certificate_path: Ruta al archivo del certificado
            password: Contraseña del certificado (si aplica)
        
        Returns:
            Dict con información del certificado y estado de validación
        """
        try:
            cert_path = Path(certificate_path)
            
            if not cert_path.exists():
                return {
                    "valid": False,
                    "error": "El archivo del certificado no existe"
                }
            
            # Leer certificado
            with open(cert_path, 'rb') as f:
                cert_data = f.read()
            
            # Intentar cargar como PKCS12/PFX
            try:
                if password:
                    private_key, certificate, additional_certificates = serialization.pkcs12.load_key_and_certificates(
                        cert_data,
                        password.encode() if isinstance(password, str) else password,
                        backend=default_backend()
                    )
                else:
                    # Intentar sin contraseña
                    private_key, certificate, additional_certificates = serialization.pkcs12.load_key_and_certificates(
                        cert_data,
                        None,
                        backend=default_backend()
                    )
            except Exception:
                # Intentar como certificado X.509 directo
                try:
                    certificate = x509.load_pem_x509_certificate(cert_data, default_backend())
                    private_key = None
                    additional_certificates = None
                except Exception:
                    return {
                        "valid": False,
                        "error": "Formato de certificado no reconocido"
                    }
            
            # Extraer información del certificado
            subject = dict(certificate.subject)
            issuer = dict(certificate.issuer)
            
            # Verificar validez temporal
            now = datetime.now()
            valid_from = certificate.not_valid_before
            valid_to = certificate.not_valid_after
            
            is_valid_time = valid_from <= now <= valid_to
            
            return {
                "valid": is_valid_time and certificate is not None,
                "subject": {
                    "common_name": subject.get(x509.NameOID.COMMON_NAME, [None])[0] if hasattr(x509.NameOID, 'COMMON_NAME') else None,
                    "organization": subject.get(x509.NameOID.ORGANIZATION_NAME, [None])[0] if hasattr(x509.NameOID, 'ORGANIZATION_NAME') else None,
                    "country": subject.get(x509.NameOID.COUNTRY_NAME, [None])[0] if hasattr(x509.NameOID, 'COUNTRY_NAME') else None,
                },
                "issuer": {
                    "common_name": issuer.get(x509.NameOID.COMMON_NAME, [None])[0] if hasattr(x509.NameOID, 'COMMON_NAME') else None,
                    "organization": issuer.get(x509.NameOID.ORGANIZATION_NAME, [None])[0] if hasattr(x509.NameOID, 'ORGANIZATION_NAME') else None,
                },
                "serial_number": str(certificate.serial_number),
                "valid_from": valid_from.isoformat(),
                "valid_to": valid_to.isoformat(),
                "has_private_key": private_key is not None,
                "is_expired": now > valid_to,
                "is_not_yet_valid": now < valid_from,
            }
        except Exception as e:
            return {
                "valid": False,
                "error": str(e)
            }
    
    def save_certificate(self, user_id: int, certificate_data: bytes, filename: str) -> str:
        """
        Guarda un certificado en el sistema de archivos
        
        Args:
            user_id: ID del usuario propietario
            certificate_data: Datos del certificado (bytes)
            filename: Nombre del archivo
        
        Returns:
            Ruta donde se guardó el certificado
        """
        # Crear directorio del usuario si no existe
        user_dir = self.certificates_dir / str(user_id)
        user_dir.mkdir(parents=True, exist_ok=True)
        
        # Guardar certificado
        cert_path = user_dir / filename
        with open(cert_path, 'wb') as f:
            f.write(certificate_data)
        
        # Establecer permisos restrictivos (solo lectura para el propietario)
        os.chmod(cert_path, 0o600)
        
        return str(cert_path)
    
    def get_certificate_path(self, user_id: int, certificate_id: int) -> Optional[str]:
        """
        Obtiene la ruta de un certificado
        
        Args:
            user_id: ID del usuario
            certificate_id: ID del certificado
        
        Returns:
            Ruta al certificado o None si no existe
        """
        cert_path = self.certificates_dir / str(user_id) / f"cert_{certificate_id}.p12"
        if cert_path.exists():
            return str(cert_path)
        return None


# Instancia global del gestor
certificate_manager = CertificateManager()

