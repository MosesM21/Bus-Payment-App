-- ============================================================
-- Bus Payment App – Seed Data
-- Kitwe bus routes, stops & fares (Zambia)
-- ============================================================

-- ── Buses ───────────────────────────────────────────────────
INSERT INTO buses (bus_number, capacity) VALUES
  ('KTW-001', 30),
  ('KTW-002', 30),
  ('KTW-003', 24);

-- ── Routes ──────────────────────────────────────────────────
INSERT INTO routes (route_name, origin, destination) VALUES
  ('Kitwe CBD – Wusakile',    'Kitwe CBD',   'Wusakile'),
  ('Kitwe CBD – Chimwemwe',   'Kitwe CBD',   'Chimwemwe'),
  ('Kitwe CBD – Nkana East',  'Kitwe CBD',   'Nkana East'),
  ('Kitwe CBD – Parklands',   'Kitwe CBD',   'Parklands'),
  ('Kitwe CBD – Mindolo',     'Kitwe CBD',   'Mindolo');

-- ── Stops for "Kitwe CBD – Wusakile" (route 1) ─────────────
INSERT INTO stops (route_id, stop_name, stop_order) VALUES
  (1, 'Kitwe CBD Bus Station',  1),
  (1, 'Freedom Avenue',         2),
  (1, 'Kamfinsa Roundabout',    3),
  (1, 'Twatasha',               4),
  (1, 'Wusakile Market',        5),
  (1, 'Wusakile Terminus',      6);

-- ── Stops for "Kitwe CBD – Chimwemwe" (route 2) ────────────
INSERT INTO stops (route_id, stop_name, stop_order) VALUES
  (2, 'Kitwe CBD Bus Station',  1),
  (2, 'Obote Avenue',           2),
  (2, 'Chimwemwe Shops',        3),
  (2, 'Chimwemwe Market',       4),
  (2, 'Chimwemwe Terminus',     5);

-- ── Stops for "Kitwe CBD – Nkana East" (route 3) ───────────
INSERT INTO stops (route_id, stop_name, stop_order) VALUES
  (3, 'Kitwe CBD Bus Station',  1),
  (3, 'Independence Avenue',    2),
  (3, 'Nkana East Shops',       3),
  (3, 'Nkana East Terminus',    4);

-- ── Stops for "Kitwe CBD – Parklands" (route 4) ────────────
INSERT INTO stops (route_id, stop_name, stop_order) VALUES
  (4, 'Kitwe CBD Bus Station',  1),
  (4, 'President Avenue',       2),
  (4, 'Parklands Shops',        3),
  (4, 'Parklands Terminus',     4);

-- ── Stops for "Kitwe CBD – Mindolo" (route 5) ──────────────
INSERT INTO stops (route_id, stop_name, stop_order) VALUES
  (5, 'Kitwe CBD Bus Station',  1),
  (5, 'Chisokone Market',       2),
  (5, 'Bulangililo',            3),
  (5, 'Mindolo Shops',          4),
  (5, 'Mindolo Terminus',       5);

-- ── Fares (Kwacha – ZMW) ───────────────────────────────────
-- Route 1: Kitwe CBD – Wusakile
INSERT INTO fares (route_id, origin_stop_order, destination_stop_order, amount) VALUES
  (1, 1, 2, 5.00),
  (1, 1, 3, 7.50),
  (1, 1, 4, 10.00),
  (1, 1, 5, 12.50),
  (1, 1, 6, 15.00);

-- Route 2: Kitwe CBD – Chimwemwe
INSERT INTO fares (route_id, origin_stop_order, destination_stop_order, amount) VALUES
  (2, 1, 2, 5.00),
  (2, 1, 3, 8.00),
  (2, 1, 4, 10.00),
  (2, 1, 5, 12.00);

-- Route 3: Kitwe CBD – Nkana East
INSERT INTO fares (route_id, origin_stop_order, destination_stop_order, amount) VALUES
  (3, 1, 2, 5.00),
  (3, 1, 3, 8.00),
  (3, 1, 4, 10.00);

-- Route 4: Kitwe CBD – Parklands
INSERT INTO fares (route_id, origin_stop_order, destination_stop_order, amount) VALUES
  (4, 1, 2, 5.00),
  (4, 1, 3, 8.00),
  (4, 1, 4, 10.00);

-- Route 5: Kitwe CBD – Mindolo
INSERT INTO fares (route_id, origin_stop_order, destination_stop_order, amount) VALUES
  (5, 1, 2, 5.00),
  (5, 1, 3, 7.00),
  (5, 1, 4, 10.00),
  (5, 1, 5, 12.00);

-- ── Seats for Bus KTW-001 (30 seats) ────────────────────────
INSERT INTO seats (bus_id, seat_number, status)
SELECT 1, generate_series(1, 30), 'available';

-- ── Seats for Bus KTW-002 (30 seats) ────────────────────────
INSERT INTO seats (bus_id, seat_number, status)
SELECT 2, generate_series(1, 30), 'available';

-- ── Seats for Bus KTW-003 (24 seats) ────────────────────────
INSERT INTO seats (bus_id, seat_number, status)
SELECT 3, generate_series(1, 24), 'available';
