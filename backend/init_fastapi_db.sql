-- Crear tablas para FastAPI backend
-- Base de datos: erp_fastapi_db

-- Tabla users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) DEFAULT 'user' NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    verification_token VARCHAR,
    verification_token_expires TIMESTAMP,
    refresh_token VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Tabla products
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE,
    price NUMERIC(10, 2) NOT NULL,
    cost NUMERIC(10, 2),
    stock INTEGER DEFAULT 0 NOT NULL,
    min_stock INTEGER DEFAULT 0 NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- Tabla sales
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    sale_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(200),
    customer_email VARCHAR(200),
    customer_phone VARCHAR(50),
    notes TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) DEFAULT 0 NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_sales_sale_number ON sales(sale_number);

-- Tabla sale_items
CREATE TABLE IF NOT EXISTS sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL
);

-- Insertar usuarios iniciales
-- Password hash para 'admin1234': $2b$12$MR8AJr48tAOi/k6uJSyQF.cipNjJK9p9L9PRTnM.qf0XNTn6oA6Qu
-- Password hash para 'user1234': $2b$12$l.Fn2KyTY.73RIV1iO2dPOFQvovwGhWdg0kw3/lJq5BGlTs8H6Seq
INSERT INTO users (email, hashed_password, name, is_active, role, is_verified) 
VALUES 
    ('admin@example.com', '$2b$12$MR8AJr48tAOi/k6uJSyQF.cipNjJK9p9L9PRTnM.qf0XNTn6oA6Qu', 'Admin', TRUE, 'admin', TRUE),
    ('user@example.com', '$2b$12$l.Fn2KyTY.73RIV1iO2dPOFQvovwGhWdg0kw3/lJq5BGlTs8H6Seq', 'Usuario', TRUE, 'user', FALSE)
ON CONFLICT (email) DO UPDATE SET
    role = EXCLUDED.role,
    is_verified = EXCLUDED.is_verified;


