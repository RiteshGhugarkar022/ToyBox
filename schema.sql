-- PostgreSQL Schema for ToyBox-AI
-- Note: Spring Boot (Hibernate) is configured to auto-generate/update these tables if you use 'spring.jpa.hibernate.ddl-auto=update'.
-- But here is the manual schema as requested!

-- Create Database (Run this separately first if not created)
-- CREATE DATABASE toyboxai;

-- Connect to 'toyboxai' database and run the following:

CREATE TABLE "user" (
    id BIGSERIAL PRIMARY KEY,
    login_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    gender VARCHAR(20),
    role VARCHAR(50)
);

CREATE TABLE toy (
    t_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION,
    description TEXT,
    ratings REAL,
    stock INTEGER,
    category VARCHAR(255)
);

CREATE TABLE orders (
    o_id BIGSERIAL PRIMARY KEY,
    amount DOUBLE PRECISION,
    status VARCHAR(100),
    date TIMESTAMP,
    customer_id BIGINT REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE payment (
    p_id BIGSERIAL PRIMARY KEY,
    amount DOUBLE PRECISION,
    method VARCHAR(100),
    o_id BIGINT REFERENCES orders(o_id) ON DELETE CASCADE,
    c_id BIGINT REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE chatbot (
    chat_id BIGSERIAL PRIMARY KEY,
    rules TEXT,
    question TEXT,
    response TEXT
);
