-- Migración para agregar facturas recurrentes
-- Ejecutar directamente en PostgreSQL para evitar problemas de encoding en Windows

-- Agregar columna recurring_invoice_id a sales (si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sales' AND column_name = 'recurring_invoice_id'
    ) THEN
        ALTER TABLE sales ADD COLUMN recurring_invoice_id INTEGER;
    END IF;
END $$;

-- Crear tabla recurring_invoices
CREATE TABLE IF NOT EXISTS recurring_invoices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    user_id INTEGER NOT NULL,
    customer_name VARCHAR(200),
    customer_email VARCHAR(200),
    customer_phone VARCHAR(50),
    frequency VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    next_run_date DATE NOT NULL,
    day_of_month INTEGER,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    total_invoices_generated INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_recurring_invoices_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Crear índices
CREATE INDEX IF NOT EXISTS ix_recurring_invoices_id ON recurring_invoices(id);
CREATE INDEX IF NOT EXISTS ix_recurring_invoices_user_id ON recurring_invoices(user_id);
CREATE INDEX IF NOT EXISTS ix_recurring_invoices_next_run_date ON recurring_invoices(next_run_date);
CREATE INDEX IF NOT EXISTS ix_recurring_invoices_is_active ON recurring_invoices(is_active);

-- Crear tabla recurring_invoice_items
CREATE TABLE IF NOT EXISTS recurring_invoice_items (
    id SERIAL PRIMARY KEY,
    recurring_invoice_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    description VARCHAR(500),
    CONSTRAINT fk_recurring_invoice_items_recurring_invoice_id 
        FOREIGN KEY (recurring_invoice_id) REFERENCES recurring_invoices(id) ON DELETE CASCADE,
    CONSTRAINT fk_recurring_invoice_items_product_id 
        FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Crear índices
CREATE INDEX IF NOT EXISTS ix_recurring_invoice_items_id ON recurring_invoice_items(id);
CREATE INDEX IF NOT EXISTS ix_recurring_invoice_items_recurring_invoice_id ON recurring_invoice_items(recurring_invoice_id);
CREATE INDEX IF NOT EXISTS ix_recurring_invoice_items_product_id ON recurring_invoice_items(product_id);

-- Agregar foreign key de sales a recurring_invoices (si la columna existe)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sales' AND column_name = 'recurring_invoice_id'
    ) THEN
        -- Verificar si el constraint ya existe
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_sales_recurring_invoice_id'
        ) THEN
            ALTER TABLE sales 
            ADD CONSTRAINT fk_sales_recurring_invoice_id 
            FOREIGN KEY (recurring_invoice_id) REFERENCES recurring_invoices(id);
        END IF;
    END IF;
END $$;

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_recurring_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para updated_at
DROP TRIGGER IF EXISTS trigger_update_recurring_invoices_updated_at ON recurring_invoices;
CREATE TRIGGER trigger_update_recurring_invoices_updated_at
    BEFORE UPDATE ON recurring_invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_recurring_invoices_updated_at();

