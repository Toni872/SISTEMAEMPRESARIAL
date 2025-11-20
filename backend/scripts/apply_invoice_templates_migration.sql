-- Migración para agregar plantillas de factura
-- Ejecutar directamente en PostgreSQL para evitar problemas de encoding en Windows

-- Crear tabla invoice_templates
CREATE TABLE IF NOT EXISTS invoice_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    html_template TEXT NOT NULL,
    header_color VARCHAR(7) DEFAULT '#3b82f6',
    footer_text TEXT,
    logo_url VARCHAR(500),
    show_tax_breakdown BOOLEAN NOT NULL DEFAULT TRUE,
    show_payment_terms BOOLEAN NOT NULL DEFAULT TRUE,
    show_notes BOOLEAN NOT NULL DEFAULT TRUE,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    user_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS ix_invoice_templates_id ON invoice_templates(id);
CREATE INDEX IF NOT EXISTS ix_invoice_templates_user_id ON invoice_templates(user_id);
CREATE INDEX IF NOT EXISTS ix_invoice_templates_is_default ON invoice_templates(is_default);
CREATE INDEX IF NOT EXISTS ix_invoice_templates_is_system ON invoice_templates(is_system);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_invoice_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para updated_at
DROP TRIGGER IF EXISTS trigger_update_invoice_templates_updated_at ON invoice_templates;
CREATE TRIGGER trigger_update_invoice_templates_updated_at
    BEFORE UPDATE ON invoice_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_invoice_templates_updated_at();

