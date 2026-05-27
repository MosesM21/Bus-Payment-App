# 🚌 Ndeshala – Bus Payment App

A full-stack bus payment and seat management system built for **Kitwe, Zambia**. Passengers can select seats, choose destinations, pay via card (Stripe) or cash, and request stops in real-time. Conductors get a live dashboard with colour-coded seats and stop notifications.

---

## Architecture

```
Bus-Payment-App/
├── backend/          # Node.js + Express REST API
├── conductor-app/    # Expo React Native (conductor)
├── passenger-app/    # Expo React Native (passenger)
├── database/         # PostgreSQL schema & seed data
└── README.md
```

## Tech Stack

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Backend   | Node.js, Express, Socket.IO           |
| Database  | PostgreSQL                            |
| Auth      | Firebase Phone Auth (OTP)             |
| Payments  | Stripe (card) + Cash recording        |
| Real-time | Socket.IO (seat updates, stop alerts) |
| Mobile    | Expo / React Native                   |

## Features

### Passenger App

- Phone OTP login via Firebase
- Real-time seat selection with colour-coded availability
- Route & destination picker with automatic fare calculation
- Stripe card payment + cash fallback
- In-trip "Request Stop" button with conductor notification

### Conductor App

- Live seat dashboard with colour-coded statuses
- Real-time stop request alerts with acknowledge button
- Trip summary with revenue breakdown (card vs cash)

### Seat Colour Codes

| Colour    | Status         | Meaning                   |
| --------- | -------------- | ------------------------- |
| 🔘 Grey   | Available      | No passenger              |
| 🟠 Orange | Reserved       | Selected, not yet paid    |
| 🔴 Red    | Occupied       | Paid, passenger on board  |
| 🟢 Green  | Stop Requested | Passenger wants to alight |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Firebase project with Phone Auth enabled
- Stripe account (test keys for development)
- Expo CLI (`npm install -g expo-cli`)

### 1. Database Setup

```bash
# Create the database
createdb bus_payment_db

# Run schema
psql -d bus_payment_db -f database/schema.sql

# Seed with Kitwe routes & fares
psql -d bus_payment_db -f database/seed.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # Fill in your credentials
npm install
npm run dev            # Starts on port 5000
```

### 3. Conductor App

```bash
cd conductor-app
npm install
npx expo start
```

### 4. Passenger App

```bash
cd passenger-app
npm install
npx expo start
```

---

## API Endpoints

| Method | Endpoint                      | Description                 |
| ------ | ----------------------------- | --------------------------- |
| POST   | `/api/auth/verify`            | Verify Firebase token       |
| GET    | `/api/auth/me`                | Get current user profile    |
| GET    | `/api/seats/:busId`           | Get all seats for a bus     |
| PATCH  | `/api/seats/:seatId/reserve`  | Reserve a seat              |
| PATCH  | `/api/seats/:seatId/release`  | Release a seat              |
| GET    | `/api/routes`                 | List all bus routes         |
| GET    | `/api/routes/:routeId`        | Route details with stops    |
| GET    | `/api/routes/:routeId/fare`   | Calculate fare (from/to)    |
| POST   | `/api/payments/create-intent` | Create Stripe PaymentIntent |
| POST   | `/api/payments/confirm`       | Confirm a payment           |
| POST   | `/api/payments/cash`          | Record a cash payment       |
| GET    | `/api/payments/history`       | User payment history        |

## Socket.IO Events

| Event               | Direction        | Description                 |
| ------------------- | ---------------- | --------------------------- |
| `join-bus`          | Client → Server  | Join a bus room             |
| `seat-update`       | Client → Server  | Notify seat status change   |
| `seat-changed`      | Server → Clients | Broadcast seat update       |
| `stop-request`      | Client → Server  | Passenger requests a stop   |
| `stop-requested`    | Server → Clients | Broadcast stop request      |
| `stop-acknowledged` | Client → Server  | Conductor acknowledges stop |
| `stop-ack`          | Server → Clients | Broadcast acknowledgment    |

---

## Environment Variables

See [`backend/.env.example`](backend/.env.example) for the full list.

## License

ISC
