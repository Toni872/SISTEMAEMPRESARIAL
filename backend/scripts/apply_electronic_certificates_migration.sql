-- Migration para tabla electronic_certificates
-- Ejecutar con: Get-Content backend\scripts\apply_electronic_certificates_migration.sql | docker exec -i erp-postgres-fastapi psql -U postgres -d erp_fastapi_db

CREATE TABLE IF NOT EXISTS electronic_certificates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(200) NOT NULL,
    certificate_type VARCHAR(50) NOT NULL,
    certificate_data TEXT,
    certificate_path VARCHAR(500),
    issuer VARCHAR(200),
    subject VARCHAR(200),
    serial_number VARCHAR(100),
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_to TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_valid BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS ix_electronic_certificates_id ON electronic_certificates(id);
CREATE INDEX IF NOT EXISTS ix_electronic_certificates_user_id ON electronic_certificates(user_id);

