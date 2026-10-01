DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS rental_contracts CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS property_amenities CASCADE;
DROP TABLE IF EXISTS amenities CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
 user_id SERIAL PRIMARY KEY, full_name VARCHAR(120) NOT NULL,
 email VARCHAR(180) UNIQUE NOT NULL, password_hash VARCHAR(300) NOT NULL,
 role VARCHAR(20) NOT NULL CHECK(role IN ('TENANT','OWNER','ADMIN')),
 phone VARCHAR(25), created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE properties (
 property_id SERIAL PRIMARY KEY, owner_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
 title VARCHAR(180) NOT NULL, description TEXT NOT NULL, property_type VARCHAR(40) NOT NULL,
 city VARCHAR(100) NOT NULL, area VARCHAR(120) NOT NULL, address TEXT,
 latitude NUMERIC(10,7), longitude NUMERIC(10,7), monthly_rent NUMERIC(12,2) NOT NULL CHECK(monthly_rent>0),
 bedrooms INTEGER NOT NULL CHECK(bedrooms>0), bathrooms INTEGER NOT NULL CHECK(bathrooms>0),
 furnished BOOLEAN NOT NULL DEFAULT FALSE, image_url TEXT,
 status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK(status IN ('AVAILABLE','BOOKED','MAINTENANCE')),
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE amenities (
 amenity_id SERIAL PRIMARY KEY, name VARCHAR(80) UNIQUE NOT NULL
);

CREATE TABLE property_amenities (
 property_id INTEGER REFERENCES properties(property_id) ON DELETE CASCADE,
 amenity_id INTEGER REFERENCES amenities(amenity_id) ON DELETE CASCADE,
 PRIMARY KEY(property_id,amenity_id)
);

CREATE TABLE bookings (
 booking_id SERIAL PRIMARY KEY, property_id INTEGER NOT NULL REFERENCES properties(property_id),
 tenant_id INTEGER NOT NULL REFERENCES users(user_id), start_date DATE NOT NULL, end_date DATE,
 monthly_rent NUMERIC(12,2) NOT NULL, booking_amount NUMERIC(12,2) NOT NULL,
 status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
 CHECK(status IN ('PENDING','CONFIRMED','CANCELLED','COMPLETED')),
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
 payment_id SERIAL PRIMARY KEY, booking_id INTEGER NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
 amount NUMERIC(12,2) NOT NULL CHECK(amount>0), payment_method VARCHAR(30) NOT NULL DEFAULT 'DEMO',
 transaction_ref VARCHAR(180) UNIQUE, status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
 CHECK(status IN ('PENDING','SUCCESS','FAILED','REFUNDED')), paid_at TIMESTAMP
);

CREATE TABLE rental_contracts (
 contract_id SERIAL PRIMARY KEY, booking_id INTEGER UNIQUE NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
 contract_number VARCHAR(80) UNIQUE NOT NULL, terms TEXT NOT NULL,
 tenant_signed BOOLEAN NOT NULL DEFAULT FALSE, owner_signed BOOLEAN NOT NULL DEFAULT FALSE,
 contract_status VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
 CHECK(contract_status IN ('DRAFT','ACTIVE','EXPIRED','TERMINATED')), created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
 tenant_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
 property_id INTEGER REFERENCES properties(property_id) ON DELETE CASCADE,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(tenant_id,property_id)
);

CREATE TABLE reviews (
 review_id SERIAL PRIMARY KEY, property_id INTEGER REFERENCES properties(property_id) ON DELETE CASCADE,
 tenant_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
 rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5), comment TEXT,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(property_id,tenant_id)
);

CREATE TABLE activities (
 activity_id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
 action VARCHAR(120) NOT NULL, description TEXT, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_area ON properties(area);
CREATE INDEX idx_properties_rent ON properties(monthly_rent);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_bookings_tenant ON bookings(tenant_id);
CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_activities_created ON activities(created_at DESC);
