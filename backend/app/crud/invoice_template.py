from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime

from ..models.invoice_template import InvoiceTemplate
from ..api.invoice_templates.schemas import InvoiceTemplateCreate, InvoiceTemplateUpdate
from ..models.sale import Sale


def get_invoice_template(db: Session, template_id: int) -> Optional[InvoiceTemplate]:
    """Obtiene una plantilla por ID"""
    return db.query(InvoiceTemplate).filter(InvoiceTemplate.id == template_id).first()


def get_invoice_templates(
    db: Session,
    user_id: Optional[int] = None,
    include_system: bool = True,
    skip: int = 0,
    limit: int = 100
) -> List[InvoiceTemplate]:
    """Lista plantillas disponibles"""
    query = db.query(InvoiceTemplate)
    
    # Filtrar: plantillas globales (user_id NULL) o del usuario
    if user_id:
        query = query.filter(
            or_(
                InvoiceTemplate.user_id == user_id,
                InvoiceTemplate.user_id.is_(None)  # Plantillas globales
            )
        )
    else:
        # Si no hay user_id, solo globales
        query = query.filter(InvoiceTemplate.user_id.is_(None))
    
    if not include_system:
        query = query.filter(InvoiceTemplate.is_system == False)
    
    return query.order_by(
        InvoiceTemplate.is_default.desc(),  # Defaults primero
        InvoiceTemplate.created_at.desc()
    ).offset(skip).limit(limit).all()


def get_default_template(db: Session, user_id: Optional[int] = None) -> Optional[InvoiceTemplate]:
    """Obtiene la plantilla por defecto"""
    query = db.query(InvoiceTemplate).filter(InvoiceTemplate.is_default == True)
    
    if user_id:
        # Buscar primero plantilla del usuario, luego global
        user_template = query.filter(InvoiceTemplate.user_id == user_id).first()
        if user_template:
            return user_template
    
    # Si no hay del usuario, buscar global
    return query.filter(InvoiceTemplate.user_id.is_(None)).first()


def create_invoice_template(
    db: Session,
    template: InvoiceTemplateCreate,
    user_id: Optional[int] = None,
    is_system: bool = False
) -> InvoiceTemplate:
    """Crea una nueva plantilla"""
    # Si se marca como default, quitar default de otras plantillas del mismo usuario
    if template.is_default:
        if user_id:
            db.query(InvoiceTemplate).filter(
                and_(
                    InvoiceTemplate.user_id == user_id,
                    InvoiceTemplate.is_default == True
                )
            ).update({"is_default": False})
        else:
            db.query(InvoiceTemplate).filter(
                and_(
                    InvoiceTemplate.user_id.is_(None),
                    InvoiceTemplate.is_default == True
                )
            ).update({"is_default": False})
    
    db_template = InvoiceTemplate(
        name=template.name,
        description=template.description,
        html_template=template.html_template,
        header_color=template.header_color,
        footer_text=template.footer_text,
        logo_url=template.logo_url,
        show_tax_breakdown=template.show_tax_breakdown,
        show_payment_terms=template.show_payment_terms,
        show_notes=template.show_notes,
        is_default=template.is_default,
        is_system=is_system,
        user_id=user_id
    )
    
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template


def update_invoice_template(
    db: Session,
    template_id: int,
    template_update: InvoiceTemplateUpdate,
    user_id: Optional[int] = None
) -> Optional[InvoiceTemplate]:
    """Actualiza una plantilla"""
    db_template = get_invoice_template(db, template_id)
    if not db_template:
        return None
    
    # Verificar que no sea plantilla del sistema (solo admin puede)
    if db_template.is_system and not user_id:  # Por ahora permitimos si no es sistema
        # En producción, verificar rol de admin
        pass
    
    # Si se marca como default, quitar default de otras
    update_data = template_update.model_dump(exclude_unset=True)
    if update_data.get("is_default") == True:
        if db_template.user_id:
            db.query(InvoiceTemplate).filter(
                and_(
                    InvoiceTemplate.user_id == db_template.user_id,
                    InvoiceTemplate.id != template_id,
                    InvoiceTemplate.is_default == True
                )
            ).update({"is_default": False})
        else:
            db.query(InvoiceTemplate).filter(
                and_(
                    InvoiceTemplate.user_id.is_(None),
                    InvoiceTemplate.id != template_id,
                    InvoiceTemplate.is_default == True
                )
            ).update({"is_default": False})
    
    for field, value in update_data.items():
        setattr(db_template, field, value)
    
    db.commit()
    db.refresh(db_template)
    return db_template


def delete_invoice_template(
    db: Session,
    template_id: int,
    user_id: Optional[int] = None
) -> bool:
    """Elimina una plantilla"""
    db_template = get_invoice_template(db, template_id)
    if not db_template:
        return False
    
    # No permitir eliminar plantillas del sistema
    if db_template.is_system:
        return False
    
    # Verificar que pertenezca al usuario (si aplica)
    if user_id and db_template.user_id != user_id:
        return False
    
    db.delete(db_template)
    db.commit()
    return True


def render_invoice_with_template(
    db: Session,
    sale_id: int,
    template_id: Optional[int] = None
) -> str:
    """
    Renderiza una factura usando una plantilla específica
    Retorna HTML renderizado
    """
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise ValueError("Venta no encontrada")
    
    # Obtener plantilla
    if template_id:
        template = get_invoice_template(db, template_id)
    else:
        template = get_default_template(db, sale.user_id)
    
    if not template:
        # Usar plantilla básica por defecto si no hay ninguna
        template = InvoiceTemplate(
            name="Default",
            html_template=get_default_html_template()
        )
    
    # Renderizar template (reemplazar placeholders)
    html = template.html_template
    
    # Reemplazar placeholders básicos
    replacements = {
        "{{sale_number}}": sale.sale_number or f"#{sale.id}",
        "{{customer_name}}": sale.customer_name or "Cliente",
        "{{customer_email}}": sale.customer_email or "",
        "{{customer_phone}}": sale.customer_phone or "",
        "{{subtotal}}": f"{float(sale.subtotal):.2f}",
        "{{tax}}": f"{float(sale.tax):.2f}",
        "{{total}}": f"{float(sale.total):.2f}",
        "{{status}}": sale.status,
        "{{created_at}}": sale.created_at.strftime("%d/%m/%Y") if sale.created_at else "",
        "{{notes}}": sale.notes or "",
        "{{header_color}}": template.header_color,
    }
    
    for placeholder, value in replacements.items():
        html = html.replace(placeholder, str(value))
    
    # Renderizar items - cargar productos si es necesario
    from sqlalchemy.orm import joinedload
    from ..models.product import Product
    
    sale_with_items = db.query(Sale).options(joinedload(Sale.items)).filter(Sale.id == sale_id).first()
    if not sale_with_items:
        raise ValueError("Venta no encontrada")
    
    items_html = ""
    for item in sale_with_items.items:
        # Obtener producto si existe
        product = db.query(Product).filter(Product.id == item.product_id).first()
        product_name = product.name if product else f"Producto ID {item.product_id}"
        
        item_html = f"""
        <tr>
            <td>{product_name}</td>
            <td>{item.quantity}</td>
            <td>€{float(item.unit_price):.2f}</td>
            <td>€{float(item.subtotal):.2f}</td>
        </tr>
        """
        items_html += item_html
    
    html = html.replace("{{items}}", items_html if items_html else "<tr><td colspan='4'>No hay items</td></tr>")
    
    # Manejar condicionales simples ({{#if notes}})
    if sale.notes:
        html = html.replace("{{#if notes}}", "")
        html = html.replace("{{/if}}", "")
    else:
        # Eliminar bloques condicionales si no hay notas
        import re
        html = re.sub(r'\{\{#if notes\}\}.*?\{\{/if\}\}', '', html, flags=re.DOTALL)
    
    return html


def get_default_html_template() -> str:
    """Retorna una plantilla HTML básica por defecto"""
    return """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: {{header_color}}; color: white; padding: 20px; border-radius: 5px; }
        .info { margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total { text-align: right; font-weight: bold; margin-top: 20px; }
        .footer { margin-top: 40px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FACTURA</h1>
        <p>Número: {{sale_number}}</p>
    </div>
    
    <div class="info">
        <h3>Cliente:</h3>
        <p><strong>{{customer_name}}</strong></p>
        <p>{{customer_email}}</p>
        <p>{{customer_phone}}</p>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            {{items}}
        </tbody>
    </table>
    
    <div class="total">
        <p>Subtotal: €{{subtotal}}</p>
        <p>IVA (21%): €{{tax}}</p>
        <p><strong>Total: €{{total}}</strong></p>
    </div>
    
    {{#if notes}}
    <div class="notes">
        <h4>Notas:</h4>
        <p>{{notes}}</p>
    </div>
    {{/if}}
    
    <div class="footer">
        <p>Fecha de emisión: {{created_at}}</p>
        <p>Estado: {{status}}</p>
    </div>
</body>
</html>
    """

