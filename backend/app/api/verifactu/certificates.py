from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ...api.auth.deps import get_db_session, get_current_user
from ...models.user import User
from ...models.electronic_certificate import ElectronicCertificate
from ...utils.certificate_manager import certificate_manager
from ...core.aeat_config import aeat_settings

router = APIRouter(prefix="/api/verifactu/certificates", tags=["verifactu-certificates"])


@router.get("")
def list_certificates(
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Lista los certificados electrónicos del usuario"""
    certificates = db.query(ElectronicCertificate).filter(
        ElectronicCertificate.user_id == current_user.id
    ).all()
    
    return [
        {
            "id": c.id,
            "name": c.name,
            "certificate_type": c.certificate_type,
            "issuer": c.issuer,
            "subject": c.subject,
            "valid_from": c.valid_from.isoformat() if c.valid_from else None,
            "valid_to": c.valid_to.isoformat() if c.valid_to else None,
            "is_active": c.is_active,
            "is_valid": c.is_valid and (c.valid_to is None or c.valid_to > datetime.now()),
            "created_at": c.created_at.isoformat(),
        }
        for c in certificates
    ]


@router.post("")
def upload_certificate(
    name: str,
    certificate_type: str,
    password: Optional[str] = None,
    file: UploadFile = File(...),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Sube y valida un certificado electrónico"""
    # Leer archivo
    certificate_data = file.file.read()
    
    # Guardar certificado en sistema de archivos
    filename = f"cert_{current_user.id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{certificate_type}"
    certificate_path = certificate_manager.store_certificate(
        current_user.id,
        certificate_data,
        filename
    )
    
    # Validar certificado
    validation_result = certificate_manager.validate_certificate(certificate_path, password)
    
    if not validation_result.get("valid"):
        # Eliminar archivo si no es válido
        import os
        if os.path.exists(certificate_path):
            os.remove(certificate_path)
        error_msg = validation_result.get('error', 'Error desconocido')
        logger.warning(f"Certificado inválido: {error_msg}", extra={"user_id": current_user.id})
        raise ValidationError(f"Certificado inválido: {error_msg}")
    
    # Crear registro en base de datos
    cert_info = validation_result
    certificate = ElectronicCertificate(
        user_id=current_user.id,
        name=name,
        certificate_type=certificate_type,
        certificate_path=certificate_path,
        issuer=cert_info.get("issuer", {}).get("common_name", ""),
        subject=cert_info.get("subject", {}).get("common_name", ""),
        serial_number=cert_info.get("serial_number"),
        valid_from=datetime.fromisoformat(cert_info["valid_from"]) if cert_info.get("valid_from") else None,
        valid_to=datetime.fromisoformat(cert_info["valid_to"]) if cert_info.get("valid_to") else None,
        is_active=True,
        is_valid=cert_info.get("valid", False),
    )
    
    db.add(certificate)
    db.commit()
    db.refresh(certificate)
    
    return {
        "message": "Certificado subido y validado exitosamente",
        "certificate_id": certificate.id,
        "name": certificate.name,
        "validation": {
            "valid": cert_info.get("valid"),
            "valid_from": cert_info.get("valid_from"),
            "valid_to": cert_info.get("valid_to"),
            "subject": cert_info.get("subject"),
        }
    }


@router.delete("/{certificate_id}")
def delete_certificate(
    certificate_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Elimina un certificado electrónico"""
    certificate = db.query(ElectronicCertificate).filter(
        ElectronicCertificate.id == certificate_id,
        ElectronicCertificate.user_id == current_user.id
    ).first()
    
    if not certificate:
        logger.warning(f"Certificado no encontrado: {certificate_id}", extra={"certificate_id": certificate_id, "user_id": current_user.id})
        raise NotFoundError("Certificado", certificate_id)
    
    db.delete(certificate)
    db.commit()
    
    return {"message": "Certificado eliminado exitosamente"}

