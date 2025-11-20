from sqlalchemy.orm import Session
from sqlalchemy import and_, extract, func
from typing import List, Optional, Dict, Any
from datetime import date, datetime, timedelta
from decimal import Decimal

from ..models.tax_declaration import TaxDeclaration, TaxModelType, TaxDeclarationStatus
from ..models.sale import Sale, SaleItem
from ..models.product import Product
from ..models.purchase import Purchase, PurchaseItem, PurchaseStatus
from ..api.tax.schemas import Model303CalculationResult, Model111CalculationResult, Model111WithholdingDetail


def get_tax_declaration(db: Session, declaration_id: int) -> Optional[TaxDeclaration]:
    """Obtiene una declaración fiscal por ID"""
    return db.query(TaxDeclaration).filter(TaxDeclaration.id == declaration_id).first()


def get_tax_declarations(
    db: Session,
    user_id: int,
    model_type: Optional[TaxModelType] = None,
    skip: int = 0,
    limit: int = 100
) -> List[TaxDeclaration]:
    """Lista declaraciones fiscales de un usuario"""
    query = db.query(TaxDeclaration).filter(TaxDeclaration.user_id == user_id)
    
    if model_type:
        query = query.filter(TaxDeclaration.model_type == model_type)
    
    return query.order_by(
        TaxDeclaration.period_year.desc(),
        TaxDeclaration.period_quarter.desc()
    ).offset(skip).limit(limit).all()


def calculate_model_303(
    db: Session,
    user_id: int,
    quarter: int,
    year: int,
    include_purchases: bool = False
) -> Model303CalculationResult:
    """
    Calcula el Modelo 303 (IVA Trimestral) para un periodo
    """
    # Calcular fechas del trimestre
    quarter_start_month = (quarter - 1) * 3 + 1
    period_start = date(year, quarter_start_month, 1)
    
    # Calcular último día del trimestre
    if quarter == 4:
        period_end = date(year, 12, 31)
    else:
        next_quarter_month = quarter_start_month + 3
        period_end = date(year, next_quarter_month, 1) - timedelta(days=1)
    
    # Obtener todas las ventas completadas del periodo
    sales = db.query(Sale).filter(
        Sale.user_id == user_id,
        Sale.status == "completed",
        Sale.created_at >= datetime.combine(period_start, datetime.min.time()),
        Sale.created_at <= datetime.combine(period_end, datetime.max.time())
    ).all()
    
    # Inicializar acumuladores
    sales_base_21 = Decimal("0")
    sales_tax_21 = Decimal("0")
    sales_base_10 = Decimal("0")
    sales_tax_10 = Decimal("0")
    sales_base_4 = Decimal("0")
    sales_tax_4 = Decimal("0")
    sales_base_exempt = Decimal("0")
    
    sales_details = []
    
    # Calcular IVA de cada venta
    for sale in sales:
        # El IVA está en sale.tax, pero necesitamos desglosar por tipo
        # Por simplicidad, asumimos que todas las ventas tienen IVA del 21%
        # En producción, esto debería venir del producto o configuración
        
        subtotal = Decimal(str(sale.subtotal))
        tax = Decimal(str(sale.tax))
        
        # Calcular tipo de IVA basado en el porcentaje
        if subtotal > 0:
            tax_rate = (tax / subtotal) * Decimal("100")
            
            if tax_rate >= Decimal("20"):  # 21%
                sales_base_21 += subtotal
                sales_tax_21 += tax
            elif tax_rate >= Decimal("9"):  # 10%
                sales_base_10 += subtotal
                sales_tax_10 += tax
            elif tax_rate >= Decimal("3"):  # 4%
                sales_base_4 += subtotal
                sales_tax_4 += tax
            else:  # Exento
                sales_base_exempt += subtotal
        
        sales_details.append({
            "sale_id": sale.id,
            "sale_number": sale.sale_number,
            "date": sale.created_at.isoformat(),
            "subtotal": float(subtotal),
            "tax": float(tax),
            "total": float(sale.total),
        })
    
    total_sales_base = sales_base_21 + sales_base_10 + sales_base_4 + sales_base_exempt
    total_sales_tax = sales_tax_21 + sales_tax_10 + sales_tax_4
    
    # Inicializar acumuladores de compras
    purchases_base_21 = Decimal("0")
    purchases_tax_21 = Decimal("0")
    purchases_base_10 = Decimal("0")
    purchases_tax_10 = Decimal("0")
    purchases_base_4 = Decimal("0")
    purchases_tax_4 = Decimal("0")
    purchases_base_exempt = Decimal("0")
    
    purchases_details = []
    
    # Calcular IVA soportado de compras si está habilitado
    if include_purchases:
        # Obtener compras aprobadas o recibidas del periodo
        # Solo contamos compras que realmente se han realizado (approved/received)
        from sqlalchemy.orm import joinedload
        purchases = db.query(Purchase).options(
            joinedload(Purchase.supplier)
        ).filter(
            Purchase.user_id == user_id,
            Purchase.status.in_([PurchaseStatus.APPROVED, PurchaseStatus.RECEIVED]),
            Purchase.purchase_date >= datetime.combine(period_start, datetime.min.time()),
            Purchase.purchase_date <= datetime.combine(period_end, datetime.max.time())
        ).all()
        
        # Calcular IVA de cada compra
        for purchase in purchases:
            # Cargar los items de la compra
            purchase_items = db.query(PurchaseItem).filter(
                PurchaseItem.purchase_id == purchase.id
            ).all()
            
            purchase_subtotal_21 = Decimal("0")
            purchase_tax_21 = Decimal("0")
            purchase_subtotal_10 = Decimal("0")
            purchase_tax_10 = Decimal("0")
            purchase_subtotal_4 = Decimal("0")
            purchase_tax_4 = Decimal("0")
            purchase_subtotal_exempt = Decimal("0")
            
            # Calcular IVA por item según su tax_rate
            for item in purchase_items:
                item_subtotal = Decimal(str(item.subtotal))
                item_tax_rate = Decimal(str(item.tax_rate))
                
                # Calcular IVA del item
                if item_tax_rate > 0:
                    item_tax = item_subtotal * (item_tax_rate / Decimal("100"))
                else:
                    item_tax = Decimal("0")
                
                # Clasificar por tipo de IVA
                if item_tax_rate >= Decimal("20"):  # 21%
                    purchase_subtotal_21 += item_subtotal
                    purchase_tax_21 += item_tax
                elif item_tax_rate >= Decimal("9"):  # 10%
                    purchase_subtotal_10 += item_subtotal
                    purchase_tax_10 += item_tax
                elif item_tax_rate >= Decimal("3"):  # 4%
                    purchase_subtotal_4 += item_subtotal
                    purchase_tax_4 += item_tax
                else:  # Exento
                    purchase_subtotal_exempt += item_subtotal
            
            # Acumular en totales globales
            purchases_base_21 += purchase_subtotal_21
            purchases_tax_21 += purchase_tax_21  # purchase_tax_21 es la variable local acumulada
            purchases_base_10 += purchase_subtotal_10
            purchases_tax_10 += purchase_tax_10  # purchase_tax_10 es la variable local acumulada
            purchases_base_4 += purchase_subtotal_4
            purchases_tax_4 += purchase_tax_4  # purchase_tax_4 es la variable local acumulada
            purchases_base_exempt += purchase_subtotal_exempt
            
            # Agregar a detalles
            purchases_details.append({
                "purchase_id": purchase.id,
                "purchase_number": purchase.purchase_number,
                "supplier_name": purchase.supplier.name if purchase.supplier else "N/A",
                "date": purchase.purchase_date.isoformat(),
                "subtotal": float(Decimal(str(purchase.subtotal))),
                "tax": float(Decimal(str(purchase.tax))),
                "total": float(Decimal(str(purchase.total))),
                "base_21": float(purchase_subtotal_21),
                "tax_21": float(purchase_tax_21),
                "base_10": float(purchase_subtotal_10),
                "tax_10": float(purchase_tax_10),
                "base_4": float(purchase_subtotal_4),
                "tax_4": float(purchase_tax_4),
            })
    
    total_purchases_base = purchases_base_21 + purchases_base_10 + purchases_base_4 + purchases_base_exempt
    total_purchases_tax = purchases_tax_21 + purchases_tax_10 + purchases_tax_4
    
    # Resultado
    result = total_sales_tax - total_purchases_tax
    result_to_pay = float(result) if result > 0 else 0.0
    result_to_refund = abs(float(result)) if result < 0 else 0.0
    
    return Model303CalculationResult(
        period=f"Q{quarter} {year}",
        period_start=period_start,
        period_end=period_end,
        sales_base_21=float(sales_base_21),
        sales_tax_21=float(sales_tax_21),
        sales_base_10=float(sales_base_10),
        sales_tax_10=float(sales_tax_10),
        sales_base_4=float(sales_base_4),
        sales_tax_4=float(sales_tax_4),
        sales_base_exempt=float(sales_base_exempt),
        total_sales_base=float(total_sales_base),
        total_sales_tax=float(total_sales_tax),
        purchases_base_21=float(purchases_base_21),
        purchases_tax_21=float(purchases_tax_21),
        purchases_base_10=float(purchases_base_10),
        purchases_tax_10=float(purchases_tax_10),
        purchases_base_4=float(purchases_base_4),
        purchases_tax_4=float(purchases_tax_4),
        total_purchases_base=float(total_purchases_base),
        total_purchases_tax=float(total_purchases_tax),
        result_to_pay=result_to_pay,
        result_to_refund=result_to_refund,
        sales_count=len(sales),
        sales_details=sales_details,
        purchases_count=len(purchases_details) if include_purchases else 0,
        purchases_details=purchases_details,
    )


def create_tax_declaration(
    db: Session,
    user_id: int,
    model_type: TaxModelType,
    calculation_result: Model303CalculationResult,
    quarter: int,
    year: int,
    notes: Optional[str] = None
) -> TaxDeclaration:
    """Crea una declaración fiscal a partir de un cálculo"""
    
    declaration_data = calculation_result.model_dump()
    
    declaration = TaxDeclaration(
        user_id=user_id,
        model_type=model_type,
        period_quarter=quarter,
        period_year=year,
        period_start_date=calculation_result.period_start,
        period_end_date=calculation_result.period_end,
        status=TaxDeclarationStatus.CALCULATED,
        declaration_data=declaration_data,
        notes=notes,
    )
    
    db.add(declaration)
    db.commit()
    db.refresh(declaration)
    
    return declaration


def update_tax_declaration(
    db: Session,
    declaration_id: int,
    update_data: Dict[str, Any]
) -> Optional[TaxDeclaration]:
    """Actualiza una declaración fiscal"""
    declaration = get_tax_declaration(db, declaration_id)
    if not declaration:
        return None
    
    for field, value in update_data.items():
        if hasattr(declaration, field):
            setattr(declaration, field, value)
    
    db.commit()
    db.refresh(declaration)
    return declaration


def calculate_model_111(
    db: Session,
    user_id: int,
    quarter: int,
    year: int,
    withholdings: list[Model111WithholdingDetail]
) -> Model111CalculationResult:
    """
    Calcula el Modelo 111 (Retenciones IRPF) para un periodo
    """
    # Calcular fechas del trimestre
    quarter_start_month = (quarter - 1) * 3 + 1
    period_start = date(year, quarter_start_month, 1)
    
    # Calcular último día del trimestre
    if quarter == 4:
        period_end = date(year, 12, 31)
    else:
        next_quarter_month = quarter_start_month + 3
        period_end = date(year, next_quarter_month, 1) - timedelta(days=1)
    
    # Calcular totales
    total_base = Decimal("0")
    total_withholdings = Decimal("0")
    
    for withholding in withholdings:
        base = Decimal(str(withholding.base_amount))
        rate = Decimal(str(withholding.withholding_rate))
        withholding_amount = base * (rate / Decimal("100"))
        
        total_base += base
        total_withholdings += withholding_amount
    
    return Model111CalculationResult(
        period=f"Q{quarter} {year}",
        period_start=period_start,
        period_end=period_end,
        total_withholdings=float(total_withholdings),
        total_base=float(total_base),
        withholding_count=len(withholdings),
        withholding_details=withholdings
    )


def create_model_111_declaration(
    db: Session,
    user_id: int,
    calculation_result: Model111CalculationResult,
    quarter: int,
    year: int,
    notes: Optional[str] = None
) -> TaxDeclaration:
    """Crea una declaración del Modelo 111 a partir de un cálculo"""
    
    declaration_data = calculation_result.model_dump()
    
    declaration = TaxDeclaration(
        user_id=user_id,
        model_type=TaxModelType.MODEL_111,
        period_quarter=quarter,
        period_year=year,
        period_start_date=calculation_result.period_start,
        period_end_date=calculation_result.period_end,
        status=TaxDeclarationStatus.CALCULATED,
        declaration_data=declaration_data,
        notes=notes,
    )
    
    db.add(declaration)
    db.commit()
    db.refresh(declaration)
    
    return declaration

