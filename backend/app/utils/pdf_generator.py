from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from datetime import date
from decimal import Decimal
from typing import Dict, Any
import io


def generate_model_303_pdf(declaration_data: Dict[str, Any], output_path: str = None) -> bytes:
    """
    Genera un PDF del Modelo 303 (IVA Trimestral)
    
    Args:
        declaration_data: Diccionario con los datos de la declaración
        output_path: Ruta opcional para guardar el archivo. Si es None, retorna bytes
    
    Returns:
        bytes: Contenido del PDF
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(output_path or buffer, pagesize=A4)
    story = []
    
    styles = getSampleStyleSheet()
    
    # Estilos personalizados
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=12,
        spaceBefore=12
    )
    
    # Título
    story.append(Paragraph("MODELO 303 - DECLARACIÓN TRIMESTRAL DE IVA", title_style))
    story.append(Spacer(1, 0.5*cm))
    
    # Información del periodo
    period_info = [
        ['Periodo:', f"{declaration_data.get('period', 'N/A')}"],
        ['Fecha de Declaración:', date.today().strftime('%d/%m/%Y')],
        ['Estado:', declaration_data.get('status', 'Pendiente')],
    ]
    
    period_table = Table(period_info, colWidths=[5*cm, 10*cm])
    period_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ]))
    story.append(period_table)
    story.append(Spacer(1, 1*cm))
    
    # Ventas (IVA Repercutido)
    story.append(Paragraph("VENTAS (IVA REPERCUTIDO)", heading_style))
    
    sales_data = [
        ['Tipo IVA', 'Base Imponible', 'IVA'],
        ['21%', f"€{format_decimal(declaration_data.get('sales_base_21', 0))}", 
         f"€{format_decimal(declaration_data.get('sales_tax_21', 0))}"],
        ['10%', f"€{format_decimal(declaration_data.get('sales_base_10', 0))}", 
         f"€{format_decimal(declaration_data.get('sales_tax_10', 0))}"],
        ['4%', f"€{format_decimal(declaration_data.get('sales_base_4', 0))}", 
         f"€{format_decimal(declaration_data.get('sales_tax_4', 0))}"],
        ['Exentas', f"€{format_decimal(declaration_data.get('sales_base_exempt', 0))}", '-'],
    ]
    
    sales_table = Table(sales_data, colWidths=[4*cm, 5.5*cm, 5.5*cm])
    sales_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')]),
    ]))
    story.append(sales_table)
    
    # Total IVA Repercutido
    total_sales_tax = declaration_data.get('total_sales_tax', 0)
    story.append(Spacer(1, 0.3*cm))
    total_sales_row = [
        ['Total IVA Repercutido:', '', f"€{format_decimal(total_sales_tax)}"]
    ]
    total_sales_table = Table(total_sales_row, colWidths=[9.5*cm, 0.5*cm, 5*cm])
    total_sales_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#dbeafe')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(total_sales_table)
    story.append(Spacer(1, 0.5*cm))
    
    # Compras (IVA Soportado)
    story.append(Paragraph("COMPRAS (IVA SOPORTADO)", heading_style))
    
    total_purchases_tax = declaration_data.get('total_purchases_tax', 0)
    purchases_data = [
        ['Total IVA Soportado:', f"€{format_decimal(total_purchases_tax)}"]
    ]
    
    purchases_table = Table(purchases_data, colWidths=[10*cm, 5*cm])
    purchases_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f3f4f6')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ]))
    story.append(purchases_table)
    story.append(Spacer(1, 1*cm))
    
    # Resultado
    result_to_pay = declaration_data.get('result_to_pay', 0)
    result_to_refund = declaration_data.get('result_to_refund', 0)
    
    if result_to_pay > 0:
        result_text = f"A INGRESAR: €{format_decimal(result_to_pay)}"
        result_color = colors.HexColor('#dc2626')
        bg_color = colors.HexColor('#fee2e2')
    elif result_to_refund > 0:
        result_text = f"A DEVOLVER: €{format_decimal(result_to_refund)}"
        result_color = colors.HexColor('#16a34a')
        bg_color = colors.HexColor('#dcfce7')
    else:
        result_text = "€0.00"
        result_color = colors.black
        bg_color = colors.HexColor('#f3f4f6')
    
    story.append(Paragraph("RESULTADO DE LA DECLARACIÓN", heading_style))
    result_data = [
        [result_text]
    ]
    result_table = Table(result_data, colWidths=[15*cm])
    result_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg_color),
        ('TEXTCOLOR', (0, 0), (-1, -1), result_color),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 16),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
        ('TOPPADDING', (0, 0), (-1, -1), 15),
        ('GRID', (0, 0), (-1, -1), 1, result_color),
    ]))
    story.append(result_table)
    
    # Notas
    if declaration_data.get('notes'):
        story.append(Spacer(1, 1*cm))
        story.append(Paragraph("NOTAS", heading_style))
        notes_para = Paragraph(declaration_data['notes'], styles['Normal'])
        story.append(notes_para)
    
    # Construir PDF
    doc.build(story)
    
    if output_path:
        return None
    
    buffer.seek(0)
    return buffer.read()


def format_decimal(value) -> str:
    """Formatea un decimal a string con 2 decimales"""
    if isinstance(value, Decimal):
        return f"{value:.2f}"
    try:
        return f"{float(value):.2f}"
    except (ValueError, TypeError):
        return "0.00"


def generate_model_111_pdf(declaration_data: Dict[str, Any], output_path: str = None) -> bytes:
    """
    Genera un PDF del Modelo 111 (Retenciones IRPF)
    
    Args:
        declaration_data: Diccionario con los datos de la declaración
        output_path: Ruta opcional para guardar el archivo. Si es None, retorna bytes
    
    Returns:
        bytes: Contenido del PDF
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(output_path or buffer, pagesize=A4)
    story = []
    
    styles = getSampleStyleSheet()
    
    # Estilos personalizados
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=12,
        spaceBefore=12
    )
    
    # Título
    story.append(Paragraph("MODELO 111 - DECLARACIÓN DE RETENCIONES IRPF", title_style))
    story.append(Spacer(1, 0.5*cm))
    
    # Información del periodo
    period_info = [
        ['Periodo:', f"{declaration_data.get('period', 'N/A')}"],
        ['Fecha de Declaración:', date.today().strftime('%d/%m/%Y')],
        ['Estado:', declaration_data.get('status', 'Pendiente')],
    ]
    
    period_table = Table(period_info, colWidths=[5*cm, 10*cm])
    period_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ]))
    story.append(period_table)
    story.append(Spacer(1, 1*cm))
    
    # Resumen
    story.append(Paragraph("RESUMEN", heading_style))
    
    summary_data = [
        ['Concepto', 'Importe'],
        ['Total Base de Retención', f"€{format_decimal(declaration_data.get('total_base', 0))}"],
        ['Total Retenciones Practicadas', f"€{format_decimal(declaration_data.get('total_withholdings', 0))}"],
        ['Número de Retenciones', str(declaration_data.get('withholding_count', 0))],
    ]
    
    summary_table = Table(summary_data, colWidths=[10*cm, 5*cm])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')]),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 1*cm))
    
    # Detalle de Retenciones
    story.append(Paragraph("DETALLE DE RETENCIONES", heading_style))
    
    withholding_details = declaration_data.get('withholding_details', [])
    
    if withholding_details:
        detail_headers = ['NIF', 'Nombre', 'Base (€)', '%', 'Retención (€)']
        detail_rows = [detail_headers]
        
        for w in withholding_details:
            detail_rows.append([
                w.get('nif', ''),
                w.get('name', ''),
                format_decimal(w.get('base_amount', 0)),
                f"{w.get('withholding_rate', 0)}%",
                format_decimal(w.get('withholding_amount', 0)),
            ])
        
        detail_table = Table(detail_rows, colWidths=[3*cm, 5*cm, 3*cm, 2*cm, 2*cm])
        detail_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (2, 0), (-1, -1), 'RIGHT'),
            ('ALIGN', (4, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')]),
        ]))
        story.append(detail_table)
    else:
        story.append(Paragraph("No hay retenciones registradas", styles['Normal']))
    
    # Total destacado
    story.append(Spacer(1, 0.5*cm))
    total_row = [
        ['TOTAL RETENCIONES:', '', f"€{format_decimal(declaration_data.get('total_withholdings', 0))}"]
    ]
    total_table = Table(total_row, colWidths=[10*cm, 0.5*cm, 4.5*cm])
    total_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#dbeafe')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(total_table)
    
    # Notas
    if declaration_data.get('notes'):
        story.append(Spacer(1, 1*cm))
        story.append(Paragraph("NOTAS", heading_style))
        notes_para = Paragraph(declaration_data['notes'], styles['Normal'])
        story.append(notes_para)
    
    # Construir PDF
    doc.build(story)
    
    if output_path:
        return None
    
    buffer.seek(0)
    return buffer.read()

