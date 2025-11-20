-- Migration para tablas de compras y proveedores
-- Ejecutar con: Get-Content backend\scripts\apply_purchases_migration.sql | docker exec -i erp-postgres-fastapi psql -U postgres -d erp_fastapi_db

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(200) NOT NULL,
    tax_id VARCHAR(50),
    email VARCHAR(200),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL DEFAULT 'España',
    contact_person VARCHAR(200),
    website VARCHAR(200),
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_suppliers_id ON suppliers(id);
CREATE INDEX IF NOT EXISTS ix_suppliers_user_id ON suppliers(user_id);

-- Tabla de compras
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    supplier_id INTEGER NOT NULL,
    purchase_number VARCHAR(50) NOT NULL UNIQUE,
    purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    notes TEXT,
    reference_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE INDEX IF NOT EXISTS ix_purchases_id ON purchases(id);
CREATE INDEX IF NOT EXISTS ix_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS ix_purchases_supplier_id ON purchases(supplier_id);
CREATE INDEX IF NOT EXISTS ix_purchases_purchase_number ON purchases(purchase_number);

-- Tabla de items de compra
CREATE TABLE IF NOT EXISTS purchase_items (
    id SERIAL PRIMARY KEY,
    purchase_id INTEGER NOT NULL,
    product_id INTEGER,
    description VARCHAR(500) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 21.0,
    subtotal NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX IF NOT EXISTS ix_purchase_items_id ON purchase_items(id);
CREATE INDEX IF NOT EXISTS ix_purchase_items_purchase_id ON purchase_items(purchase_id);
CREATE INDEX IF NOT EXISTS ix_purchase_items_product_id ON purchase_items(product_id);

