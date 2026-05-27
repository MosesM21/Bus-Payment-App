-- ============================================================
-- Bus Payment App – Database Schema
-- PostgreSQL
-- ============================================================

-- ── Users ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  firebase_uid  VARCHAR(128) UNIQUE NOT NULL,
  phone_number  VARCHAR(20),
  display_name  VARCHAR(100),
  role          VARCHAR(20) DEFAULT 'passenger' CHECK (role IN ('passenger', 'conductor', 'admin')),
  created_at    TIMESTAMP DEFAULT NOW(),
  last_login    TIMESTAMP DEFAULT NOW()
);

-- ── Buses ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS buses (
  id            SERIAL PRIMARY KEY,
  bus_number    VARCHAR(20) UNIQUE NOT NULL,
  capacity      INTEGER NOT NULL DEFAULT 30,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ── Routes ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS routes (
  id            SERIAL PRIMARY KEY,
  route_name    VARCHAR(100) NOT NULL,
  origin        VARCHAR(100) NOT NULL,
  destination   VARCHAR(100) NOT NULL,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ── Stops (ordered waypoints on a route) ────────────────────
CREATE TABLE IF NOT EXISTS stops (
  id            SERIAL PRIMARY KEY,
  route_id      INTEGER REFERENCES routes(id) ON DELETE CASCADE,
  stop_name     VARCHAR(100) NOT NULL,
  stop_order    INTEGER NOT NULL,
  latitude      DECIMAL(10, 7),
  longitude     DECIMAL(10, 7),
  UNIQUE (route_id, stop_order)
);

-- ── Fares (point-to-point pricing) ──────────────────────────
CREATE TABLE IF NOT EXISTS fares (
  id                     SERIAL PRIMARY KEY,
  route_id               INTEGER REFERENCES routes(id) ON DELETE CASCADE,
  origin_stop_order      INTEGER NOT NULL,
  destination_stop_order INTEGER NOT NULL,
  amount                 DECIMAL(10, 2) NOT NULL,
  currency               VARCHAR(3) DEFAULT 'ZMW'
);

-- ── Seats ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seats (
  id            SERIAL PRIMARY KEY,
  bus_id        INTEGER REFERENCES buses(id) ON DELETE CASCADE,
  seat_number   INTEGER NOT NULL,
  status        VARCHAR(20) DEFAULT 'available'
                  CHECK (status IN ('available', 'reserved', 'occupied', 'stopping')),
  passenger_id  VARCHAR(128),
  destination   VARCHAR(100),
  updated_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE (bus_id, seat_number)
);

-- ── Payments ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                SERIAL PRIMARY KEY,
  user_id           VARCHAR(128) NOT NULL,
  seat_id           INTEGER REFERENCES seats(id),
  route_id          INTEGER REFERENCES routes(id),
  amount            DECIMAL(10, 2) NOT NULL,
  currency          VARCHAR(3) DEFAULT 'ZMW',
  method            VARCHAR(10) CHECK (method IN ('card', 'cash')),
  stripe_intent_id  VARCHAR(255),
  status            VARCHAR(20) DEFAULT 'pending'
                      CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_seats_bus ON seats(bus_id);
CREATE INDEX IF NOT EXISTS idx_seats_status ON seats(status);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_stops_route ON stops(route_id);
CREATE INDEX IF NOT EXISTS idx_fares_route ON fares(route_id);
