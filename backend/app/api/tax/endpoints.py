from fastapi import APIRouter, Depends, status, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field

from ...api.auth.deps import get_db_session, get_current_user
from ...core.exceptions import NotFoundError, AuthorizationError, ValidationError, BusinessLogicError, DatabaseError
from ...core.logging_config import get_logger
from ...models.user import User

logger = get_logger(__name__)
from ...models.tax_declaration import TaxModelType, TaxDeclarationStatus
from ...crud.tax import (
    get_tax_declaration,
    get_tax_declarations,
    calculate_model_303,
    create_tax_declaration,
    update_tax_declaration,
    calculate_model_111,
    create_model_111_declaration
)
from .schemas import (
    TaxDeclarationOut,
    TaxDeclarationCreate,
    TaxDeclarationUpdate,
    Model303CalculationRequest,
    Model303CalculationResult,
    Model303GenerateRequest,
    Model111CalculationRequest,
    Model111CalculationResult,
    Model111GenerateRequest,
    Model111WithholdingDetail
)

router = APIRouter(prefix="/api/tax", tags=["tax"])


@router.get("/declarations", response_model=List[TaxDeclarationOut])
def list_tax_declarations(
    model_type: Optional[str] = Query(None, description="Tipo de modelo (303, 111, etc.)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Lista declaraciones fiscales del usuario"""
    tax_model_type = None
    if model_type:
        try:
            tax_model_type = TaxModelType(model_type)
        except ValueError:
            logger.warning(f"Tipo de modelo inválido: {model_type}", extra={"model_type": model_type})
            raise ValidationError(f"Tipo de modelo inválido: {model_type}", field="model_type")
    
    declarations = get_tax_declarations(
        db,
        user_id=current_user.id,
        model_type=tax_model_type,
        skip=skip,
        limit=limit
    )
    return declarations


@router.get("/declarations/{declaration_id}", response_model=TaxDeclarationOut)
def get_tax_declaration_by_id(
    declaration_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Obtiene una declaración fiscal por ID"""
    declaration = get_tax_declaration(db, declaration_id)
    if not declaration:
        logger.warning(f"Declaración fiscal no encontrada: {declaration_id}", extra={"declaration_id": declaration_id, "user_id": current_user.id})
        raise NotFoundError("Declaración fiscal", declaration_id)
    
    if declaration.user_id != current_user.id:
        logger.warning(f"Intento de acceso no autorizado a declaración: {declaration_id}", extra={"declaration_id": declaration_id, "user_id": current_user.id, "owner_id": declaration.user_id})
        raise AuthorizationError("No tienes permiso para ver esta declaración")
    
    return declaration


@router.post("/model-303/calculate", response_model=Model303CalculationResult)
def calculate_model_303_endpoint(
    request: Model303CalculationRequest,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """
    Calcula el Modelo 303 (IVA Trimestral) para un periodo
    Retorna los cálculos sin crear la declaración
    """
    try:
        result = calculate_model_303(
            db,
            user_id=current_user.id,
            quarter=request.quarter,
            year=request.year,
            include_purchases=request.include_purchases
        )
        return result
    except Exception as e:
        logger.error(f"Error calculando modelo 303: {str(e)}", extra={"user_id": current_user.id}, exc_info=True)
        raise DatabaseError(f"Error calculando modelo 303: {str(e)}")


@router.post("/model-303/generate", response_model=TaxDeclarationOut, status_code=status.HTTP_201_CREATED)
def generate_model_303(
    request: Model303GenerateRequest,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """
    Calcula y genera una declaración del Modelo 303
    Crea el registro en la base de datos
    """
    try:
        # Calcular primero
        calculation_result = calculate_model_303(
            db,
            user_id=current_user.id,
            quarter=request.quarter,
            year=request.year,
            include_purchases=request.include_purchases
        )
        
        # Crear declaración
        declaration = create_tax_declaration(
            db,
            user_id=current_user.id,
            model_type=TaxModelType.MODEL_303,
            calculation_result=calculation_result,
            quarter=request.quarter,
            year=request.year,
            notes=request.notes
        )
        
        return declaration
    except Exception as e:
        logger.error(f"Error generando modelo 303: {str(e)}", extra={"user_id": current_user.id}, exc_info=True)
        raise DatabaseError(f"Error generando modelo 303: {str(e)}")


@router.put("/declarations/{declaration_id}", response_model=TaxDeclarationOut)
def update_tax_declaration_endpoint(
    declaration_id: int,
    update_data: TaxDeclarationUpdate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Actualiza una declaración fiscal"""
    declaration = get_tax_declaration(db, declaration_id)
    if not declaration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Declaración fiscal no encontrada"
        )
    
    if declaration.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para actualizar esta declaración"
        )
    
    update_dict = update_data.model_dump(exclude_unset=True)
    updated = update_tax_declaration(db, declaration_id, update_dict)
    
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Declaración fiscal no encontrada"
        )
    
    return updated


@router.get("/declarations/{declaration_id}/pdf")
def download_tax_declaration_pdf(
    declaration_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """Genera y descarga el PDF de una declaración fiscal (Modelo 303 o 111)"""
    declaration = get_tax_declaration(db, declaration_id)
    if not declaration:
        logger.warning(f"Declaración fiscal no encontrada para PDF: {declaration_id}", extra={"declaration_id": declaration_id, "user_id": current_user.id})
        raise NotFoundError("Declaración fiscal", declaration_id)
    
    if declaration.user_id != current_user.id:
        logger.warning(f"Intento de descargar PDF de declaración no autorizada: {declaration_id}", extra={"declaration_id": declaration_id, "user_id": current_user.id, "owner_id": declaration.user_id})
        raise AuthorizationError("No tienes permiso para ver esta declaración")
    
    try:
        from ...utils.pdf_generator import generate_model_303_pdf, generate_model_111_pdf
        
        # Obtener datos de la declaración
        declaration_data = declaration.declaration_data if isinstance(declaration.declaration_data, dict) else {}
        declaration_data['period'] = f"Q{declaration.period_quarter} {declaration.period_year}" if declaration.period_quarter else f"{declaration.period_year}"
        declaration_data['status'] = declaration.status.value
        
        # Generar PDF según el tipo de modelo
        if declaration.model_type == TaxModelType.MODEL_303:
            pdf_bytes = generate_model_303_pdf(declaration_data)
            filename = f"modelo_303_q{declaration.period_quarter}_{declaration.period_year}.pdf"
        elif declaration.model_type == TaxModelType.MODEL_111:
            pdf_bytes = generate_model_111_pdf(declaration_data)
            filename = f"modelo_111_q{declaration.period_quarter}_{declaration.period_year}.pdf"
        else:
            logger.warning(f"Generación de PDF no disponible para modelo: {declaration.model_type}", extra={"model_type": declaration.model_type})
            raise BusinessLogicError(f"Generación de PDF no disponible para modelo {declaration.model_type}")
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generando PDF: {str(e)}", extra={"declaration_id": declaration_id}, exc_info=True)
        raise DatabaseError(f"Error generando PDF: {str(e)}")


class Model111CalculateRequest(BaseModel):
    """Request para calcular Modelo 111"""
    quarter: int = Field(..., ge=1, le=4)
    year: int = Field(..., ge=2000, le=2100)
    withholdings: List[Model111WithholdingDetail] = Field(..., description="Lista de retenciones")


@router.post("/model-111/calculate", response_model=Model111CalculationResult)
def calculate_model_111_endpoint(
    request: Model111CalculateRequest,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """
    Calcula el Modelo 111 (Retenciones IRPF) para un periodo
    Retorna los cálculos sin crear la declaración
    """
    try:
        result = calculate_model_111(
            db,
            user_id=current_user.id,
            quarter=request.quarter,
            year=request.year,
            withholdings=request.withholdings
        )
        return result
    except Exception as e:
        logger.error(f"Error calculando modelo 111: {str(e)}", extra={"user_id": current_user.id}, exc_info=True)
        raise DatabaseError(f"Error calculando modelo 111: {str(e)}")


@router.post("/model-111/generate", response_model=TaxDeclarationOut, status_code=status.HTTP_201_CREATED)
def generate_model_111(
    request: Model111GenerateRequest,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """
    Calcula y genera una declaración del Modelo 111
    Crea el registro en la base de datos
    """
    try:
        # Calcular primero
        calculation_result = calculate_model_111(
            db,
            user_id=current_user.id,
            quarter=request.quarter,
            year=request.year,
            withholdings=request.withholdings
        )
        
        # Crear declaración
        declaration = create_model_111_declaration(
            db,
            user_id=current_user.id,
            calculation_result=calculation_result,
            quarter=request.quarter,
            year=request.year,
            notes=request.notes
        )
        
        return declaration
    except Exception as e:
        logger.error(f"Error generando modelo 111: {str(e)}", extra={"user_id": current_user.id}, exc_info=True)
        raise DatabaseError(f"Error generando modelo 111: {str(e)}")

