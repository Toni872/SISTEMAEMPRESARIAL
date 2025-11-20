-- Migration para tabla invoice_registry (Verifactu)
-- Ejecutar con: Get-Content backend\scripts\apply_invoice_registry_migration.sql | docker exec -i erp-postgres-fastapi psql -U postgres -d erp_fastapi_db

CREATE TABLE IF NOT EXISTS invoice_registry (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    hash VARCHAR(64) NOT NULL UNIQUE,
    previous_hash VARCHAR(64),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    invoice_data TEXT NOT NULL,
    xml_path VARCHAR(500),
    sent_to_aeat BOOLEAN NOT NULL DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    qr_code TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS ix_invoice_registry_id ON invoice_registry(id);
CREATE INDEX IF NOT EXISTS ix_invoice_registry_sale_id ON invoice_registry(sale_id);
CREATE INDEX IF NOT EXISTS ix_invoice_registry_hash ON invoice_registry(hash);
CREATE INDEX IF NOT EXISTS ix_invoice_registry_previous_hash ON invoice_registry(previous_hash);

