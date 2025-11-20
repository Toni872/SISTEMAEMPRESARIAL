-- Migración para agregar declaraciones fiscales
-- Ejecutar directamente en PostgreSQL para evitar problemas de encoding en Windows

-- Crear tipos ENUM
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'taxmodeltype') THEN
        CREATE TYPE taxmodeltype AS ENUM ('303', '111', '130', '347');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'taxdeclarationstatus') THEN
        CREATE TYPE taxdeclarationstatus AS ENUM ('draft', 'calculated', 'generated', 'submitted', 'accepted', 'rejected');
    END IF;
END $$;

-- Crear tabla tax_declarations
CREATE TABLE IF NOT EXISTS tax_declarations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    model_type taxmodeltype NOT NULL,
    period_quarter INTEGER CHECK (period_quarter >= 1 AND period_quarter <= 4),
    period_year INTEGER NOT NULL CHECK (period_year >= 2000 AND period_year <= 2100),
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    status taxdeclarationstatus NOT NULL DEFAULT 'draft',
    declaration_data JSONB,
    submitted_at TIMESTAMP WITH TIME ZONE,
    response_data JSONB,
    reference_number VARCHAR(50),
    pdf_path VARCHAR(500),
    xml_path VARCHAR(500),
    notes TEXT,
    is_rectification VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS ix_tax_declarations_id ON tax_declarations(id);
CREATE INDEX IF NOT EXISTS ix_tax_declarations_user_id ON tax_declarations(user_id);
CREATE INDEX IF NOT EXISTS ix_tax_declarations_model_type ON tax_declarations(model_type);
CREATE INDEX IF NOT EXISTS ix_tax_declarations_period ON tax_declarations(period_year, period_quarter);

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_tax_declarations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger
DROP TRIGGER IF EXISTS trigger_update_tax_declarations_updated_at ON tax_declarations;
CREATE TRIGGER trigger_update_tax_declarations_updated_at
    BEFORE UPDATE ON tax_declarations
    FOR EACH ROW
    EXECUTE FUNCTION update_tax_declarations_updated_at();

