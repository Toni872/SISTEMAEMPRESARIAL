"""
Script para crear plantillas de factura predefinidas del sistema
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.crud.invoice_template import create_invoice_template
from app.api.invoice_templates.schemas import InvoiceTemplateCreate
from app.models.invoice_template import InvoiceTemplate


def get_template_html(template_name: str) -> str:
    """Retorna el HTML de una plantilla predefinida"""
    templates = {
        "moderna": """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; background: #f5f5f5; }
        .invoice-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, {{header_color}} 0%, #2563eb 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
        .header h1 { font-size: 32px; margin-bottom: 10px; }
        .header p { font-size: 14px; opacity: 0.9; }
        .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
        .info-box h3 { color: #333; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; }
        .info-box p { color: #666; margin: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: 600; color: #333; border-bottom: 2px solid #e9ecef; }
        td { padding: 12px; border-bottom: 1px solid #e9ecef; color: #555; }
        .total-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px; }
        .total-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .total-final { font-size: 24px; font-weight: bold; color: {{header_color}}; border-top: 2px solid #e9ecef; padding-top: 10px; margin-top: 10px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 12px; color: #999; text-align: center; }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>FACTURA</h1>
            <p>Número: {{sale_number}} | Fecha: {{created_at}}</p>
        </div>
        
        <div class="info-section">
            <div class="info-box">
                <h3>Cliente</h3>
                <p><strong>{{customer_name}}</strong></p>
                <p>{{customer_email}}</p>
                <p>{{customer_phone}}</p>
            </div>
            <div class="info-box">
                <h3>Información</h3>
                <p>Estado: <strong>{{status}}</strong></p>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Producto/Servicio</th>
                    <th style="text-align: center;">Cantidad</th>
                    <th style="text-align: right;">Precio Unit.</th>
                    <th style="text-align: right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                {{items}}
            </tbody>
        </table>
        
        <div class="total-section">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>€{{subtotal}}</span>
            </div>
            <div class="total-row">
                <span>IVA (21%):</span>
                <span>€{{tax}}</span>
            </div>
            <div class="total-row total-final">
                <span>TOTAL:</span>
                <span>€{{total}}</span>
            </div>
        </div>
        
        {{#if notes}}
        <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
            <strong>Notas:</strong> {{notes}}
        </div>
        {{/if}}
        
        <div class="footer">
            <p>{{footer_text}}</p>
        </div>
    </div>
</body>
</html>
        """,
        
        "clasica": """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Times New Roman', serif; margin: 40px; }
        .header { text-align: center; border-bottom: 3px solid {{header_color}}; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { font-size: 28px; color: {{header_color}}; margin-bottom: 10px; }
        .company-info { text-align: center; margin: 20px 0; }
        .invoice-info { display: flex; justify-content: space-between; margin: 30px 0; }
        .info-box { flex: 1; }
        .info-box h3 { border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        th { background: {{header_color}}; color: white; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        .totals { float: right; width: 300px; margin-top: 20px; }
        .total-line { display: flex; justify-content: space-between; padding: 8px 0; }
        .total-final { font-size: 18px; font-weight: bold; border-top: 2px solid {{header_color}}; padding-top: 10px; margin-top: 10px; }
        .footer { clear: both; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 11px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FACTURA</h1>
        <div class="company-info">
            <p>Número: {{sale_number}}</p>
            <p>Fecha: {{created_at}}</p>
        </div>
    </div>
    
    <div class="invoice-info">
        <div class="info-box">
            <h3>Cliente</h3>
            <p><strong>{{customer_name}}</strong></p>
            <p>{{customer_email}}</p>
            <p>{{customer_phone}}</p>
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Descripción</th>
                <th style="text-align: center;">Cant.</th>
                <th style="text-align: right;">Precio</th>
                <th style="text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            {{items}}
        </tbody>
    </table>
    
    <div class="totals">
        <div class="total-line">
            <span>Subtotal:</span>
            <span>€{{subtotal}}</span>
        </div>
        <div class="total-line">
            <span>IVA (21%):</span>
            <span>€{{tax}}</span>
        </div>
        <div class="total-line total-final">
            <span>TOTAL:</span>
            <span>€{{total}}</span>
        </div>
    </div>
    
    {{#if notes}}
    <div style="margin-top: 30px;">
        <strong>Observaciones:</strong><br>
        {{notes}}
    </div>
    {{/if}}
    
    <div class="footer">
        <p>{{footer_text}}</p>
    </div>
</body>
</html>
        """,
        
        "minimalista": """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
        .header { border-left: 4px solid {{header_color}}; padding-left: 20px; margin-bottom: 30px; }
        .header h1 { color: {{header_color}}; margin: 0; }
        .meta { color: #666; font-size: 14px; margin-top: 5px; }
        .section { margin: 25px 0; }
        .section-title { font-weight: bold; color: #333; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { text-align: left; padding: 8px; border-bottom: 2px solid {{header_color}}; color: #333; }
        td { padding: 8px; border-bottom: 1px solid #eee; }
        .total { text-align: right; margin-top: 20px; }
        .total-line { padding: 5px 0; }
        .total-final { font-size: 20px; font-weight: bold; color: {{header_color}}; border-top: 2px solid {{header_color}}; padding-top: 10px; margin-top: 10px; }
        .footer { margin-top: 40px; font-size: 11px; color: #999; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FACTURA</h1>
        <div class="meta">{{sale_number}} · {{created_at}}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Cliente</div>
        <div>{{customer_name}}</div>
        <div style="color: #666; font-size: 14px;">{{customer_email}} · {{customer_phone}}</div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Concepto</th>
                <th style="text-align: right;">Cant.</th>
                <th style="text-align: right;">Precio</th>
                <th style="text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            {{items}}
        </tbody>
    </table>
    
    <div class="total">
        <div class="total-line">Subtotal: €{{subtotal}}</div>
        <div class="total-line">IVA: €{{tax}}</div>
        <div class="total-line total-final">Total: €{{total}}</div>
    </div>
    
    {{#if notes}}
    <div class="section">
        <div class="section-title">Notas</div>
        <div>{{notes}}</div>
    </div>
    {{/if}}
    
    <div class="footer">{{footer_text}}</div>
</body>
</html>
        """
    }
    return templates.get(template_name, templates["moderna"])


def seed_templates():
    """Crea plantillas predefinidas del sistema"""
    db: Session = SessionLocal()
    try:
        # Verificar si ya existen plantillas del sistema
        existing = db.query(InvoiceTemplate).filter(InvoiceTemplate.is_system == True).count()
        if existing > 0:
            print(f"Ya existen {existing} plantillas del sistema. Saltando creación.")
            return
        
        templates_to_create = [
            {
                "name": "Moderna",
                "description": "Plantilla moderna con diseño limpio y profesional",
                "html_template": get_template_html("moderna"),
                "header_color": "#3b82f6",
                "is_default": True,
                "is_system": True
            },
            {
                "name": "Clásica",
                "description": "Plantilla clásica estilo tradicional",
                "html_template": get_template_html("clasica"),
                "header_color": "#1f2937",
                "is_default": False,
                "is_system": True
            },
            {
                "name": "Minimalista",
                "description": "Plantilla minimalista y simple",
                "html_template": get_template_html("minimalista"),
                "header_color": "#10b981",
                "is_default": False,
                "is_system": True
            }
        ]
        
        for template_data in templates_to_create:
            template_create = InvoiceTemplateCreate(**template_data)
            template = create_invoice_template(db, template_create, user_id=None, is_system=True)
            print(f"Plantilla creada: {template.name} (ID: {template.id})")
        
        print(f"\n✅ {len(templates_to_create)} plantillas del sistema creadas exitosamente")
        
    except Exception as e:
        print(f"❌ Error creando plantillas: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_templates()

