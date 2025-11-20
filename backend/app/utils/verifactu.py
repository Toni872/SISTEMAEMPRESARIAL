"""
Utilidades para cumplir con Verifactu (AEAT)
Generación de hash SHA-256, XML Facturae 3.2, y gestión de registros
"""
import hashlib
import json
from datetime import datetime
from typing import Dict, Any, Optional
from decimal import Decimal


def calculate_invoice_hash(invoice_data: Dict[str, Any]) -> str:
    """
    Calcula el hash SHA-256 de una factura
    Incluye todos los campos relevantes para garantizar integridad
    
    Args:
        invoice_data: Diccionario con los datos de la factura
    
    Returns:
        str: Hash SHA-256 en hexadecimal (64 caracteres)
    """
    # Ordenar y serializar los datos de forma determinística
    # Convertir Decimal a string para serialización consistente
    def serialize_value(value):
        if isinstance(value, Decimal):
            return str(value)
        elif isinstance(value, datetime):
            return value.isoformat()
        elif isinstance(value, dict):
            return {k: serialize_value(v) for k, v in sorted(value.items())}
        elif isinstance(value, list):
            return [serialize_value(item) for item in value]
        return value
    
    serialized_data = json.dumps(
        serialize_value(invoice_data),
        sort_keys=True,
        ensure_ascii=False
    )
    
    # Calcular hash SHA-256
    hash_object = hashlib.sha256(serialized_data.encode('utf-8'))
    return hash_object.hexdigest()


def generate_facturae_xml(invoice_data: Dict[str, Any], previous_hash: Optional[str] = None) -> str:
    """
    Genera XML según especificación Facturae 3.2 con metadatos Verifactu
    
    Args:
        invoice_data: Datos de la factura
        previous_hash: Hash del registro anterior (para trazabilidad)
    
    Returns:
        str: XML completo de la factura
    """
    # Calcular hash de la factura
    invoice_hash = calculate_invoice_hash(invoice_data)
    
    # Fecha actual
    current_date = datetime.now().strftime('%Y-%m-%d')
    current_datetime = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
    
    # Datos básicos de la factura
    invoice_number = invoice_data.get('sale_number', '')
    issue_date = invoice_data.get('created_at', current_date)
    if isinstance(issue_date, datetime):
        issue_date = issue_date.strftime('%Y-%m-%d')
    
    # Cliente
    customer_name = invoice_data.get('customer_name', '')
    customer_nif = invoice_data.get('customer_nif', '')
    customer_email = invoice_data.get('customer_email', '')
    
    # Totales
    subtotal = float(invoice_data.get('subtotal', 0))
    tax = float(invoice_data.get('tax', 0))
    total = float(invoice_data.get('total', 0))
    
    # Items
    items = invoice_data.get('items', [])
    
    # Construir XML Facturae 3.2
    xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<fe:Facturae xmlns:fe="http://www.facturae.gob.es/formato/Versiones/Facturae-3_2_2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.facturae.gob.es/formato/Versiones/Facturae-3_2_2 https://www.facturae.gob.es/formato/Versiones/Facturae-3_2_2-20110707.xsd">
    <FileHeader>
        <SchemaVersion>3.2.2</SchemaVersion>
        <Modality>I</Modality>
        <InvoiceIssuerType>EM</InvoiceIssuerType>
    </FileHeader>
    <Parties>
        <SellerParty>
            <TaxIdentification>
                <PersonTypeCode>J</PersonTypeCode>
                <ResidenceTypeCode>R</ResidenceTypeCode>
                <TaxIdentificationNumber>B12345678</TaxIdentificationNumber>
            </TaxIdentification>
            <LegalEntity>
                <CorporateName>Mi Empresa</CorporateName>
            </LegalEntity>
        </SellerParty>
        <BuyerParty>
            <TaxIdentification>
                <PersonTypeCode>J</PersonTypeCode>
                <ResidenceTypeCode>R</ResidenceTypeCode>
                <TaxIdentificationNumber>{customer_nif or '00000000A'}</TaxIdentificationNumber>
            </TaxIdentification>
            <LegalEntity>
                <CorporateName>{customer_name or 'Cliente'}</CorporateName>
            </LegalEntity>
        </BuyerParty>
    </Parties>
    <Invoices>
        <Invoice>
            <InvoiceHeader>
                <InvoiceNumber>{invoice_number}</InvoiceNumber>
                <InvoiceSeriesCode>FAC</InvoiceSeriesCode>
                <InvoiceDocumentType>FC</InvoiceDocumentType>
                <InvoiceClass>OO</InvoiceClass>
            </InvoiceHeader>
            <InvoiceIssueData>
                <IssueDate>{issue_date}</IssueDate>
                <InvoiceCurrencyCode>EUR</InvoiceCurrencyCode>
            </InvoiceIssueData>
            <Items>
'''
    
    # Agregar items
    for item in items:
        product_name = item.get('product_name', item.get('product', {}).get('name', 'Producto'))
        quantity = float(item.get('quantity', 1))
        unit_price = float(item.get('unit_price', 0))
        item_total = quantity * unit_price
        
        xml += f'''                <InvoiceLine>
                    <ItemDescription>{product_name}</ItemDescription>
                    <Quantity>{quantity}</Quantity>
                    <UnitOfMeasure>01</UnitOfMeasure>
                    <UnitPriceWithoutTax>{unit_price:.2f}</UnitPriceWithoutTax>
                    <TotalCost>{item_total:.2f}</TotalCost>
                    <TaxesOutputs>
                        <Tax>
                            <TaxTypeCode>01</TaxTypeCode>
                            <TaxRate>21.00</TaxRate>
                            <TaxBase>{item_total:.2f}</TaxBase>
                            <TaxAmount>{(item_total * 0.21):.2f}</TaxAmount>
                        </Tax>
                    </TaxesOutputs>
                </InvoiceLine>
'''
    
    xml += f'''            </Items>
            <Totals>
                <TotalGrossAmount>{subtotal:.2f}</TotalGrossAmount>
                <TotalGeneralDiscounts>0.00</TotalGeneralDiscounts>
                <TotalGeneralSurcharges>0.00</TotalGeneralSurcharges>
                <TotalGrossAmountBeforeTaxes>{subtotal:.2f}</TotalGrossAmountBeforeTaxes>
                <TotalTaxOutputs>
                    <Tax>
                        <TaxTypeCode>01</TaxTypeCode>
                        <TaxRate>21.00</TaxRate>
                        <TaxBase>{subtotal:.2f}</TaxBase>
                        <TaxAmount>{tax:.2f}</TaxAmount>
                    </Tax>
                </TotalTaxOutputs>
                <TotalTaxesWithheld>0.00</TotalTaxesWithheld>
                <InvoiceTotal>{total:.2f}</InvoiceTotal>
                <TotalOutstandingAmount>{total:.2f}</TotalOutstandingAmount>
            </Totals>
        </Invoice>
    </Invoices>
    <VerifactuMetadata>
        <Hash>{invoice_hash}</Hash>
        <PreviousHash>{previous_hash or ''}</PreviousHash>
        <Timestamp>{current_datetime}</Timestamp>
        <InvoiceNumber>{invoice_number}</InvoiceNumber>
    </VerifactuMetadata>
</fe:Facturae>'''
    
    return xml


def generate_qr_code_data(invoice_data: Dict[str, Any], hash_value: str) -> str:
    """
    Genera los datos para el código QR de Verifactu
    El QR debe permitir verificación en la sede electrónica de la AEAT
    
    Args:
        invoice_data: Datos de la factura
        hash_value: Hash SHA-256 de la factura
    
    Returns:
        str: Datos para el código QR
    """
    # Formato: URL de verificación + hash + número de factura
    invoice_number = invoice_data.get('sale_number', '')
    qr_data = f"https://sede.agenciatributaria.gob.es/verifactu/verificar?h={hash_value}&n={invoice_number}"
    return qr_data

