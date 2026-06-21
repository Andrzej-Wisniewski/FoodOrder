# FoodOrder

Aplikacja do zamawiania jedzenia: React SPA + Express API + MongoDB + Stripe

Dostępna pod adresem: https://andrzej-wisniewski.github.io/FoodOrder/

## Stack

| Warstwa   | Technologie                   |
| --------- | ----------------------------- |
| Frontend  | React 19, Vite 7, CSS Modules |
| Backend   | Express 5, Mongoose 9         |
| Baza      | MongoDB                       |
| Auth      | JWT (1h), bcrypt              |
| Płatności | Stripe Checkout + webhook     |

## Quick start

```bash
git clone <url-repozytorium>
cd FoodOrder

# Backend
cd backend
npm install
# utwórz .env — patrz docs/README.md
npm run dev          # http://localhost:3000

# Frontend (drugi terminal)
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Vite proxy przekierowuje `/api` i `/images` na backend.

**Konto admina** tworzy się przy pierwszym starcie backendu (email: `admin@test.com`, hasło: wartość `ADMIN_SECRET`).

## Dokumentacja

Pełna dokumentacja w katalogu [`docs/`](docs/README.md):

- [Architektura](docs/architecture/overview.md) — wdrożenie, warstwy
- [Diagram klas](docs/architecture/class-diagram.md) — modele, konteksty, API
- [Komponenty](docs/architecture/component-diagram.md) — moduły frontend ↔ backend
- [Przepływ danych](docs/architecture/data-flow.md) — DFD
- [Stany zamówienia](docs/architecture/order-states.md) — `status` + `paymentStatus`
- [Sekwencje](docs/diagrams/sequences/) — auth, checkout, Stripe, admin
- [Ścieżki użytkownika](docs/diagrams/activity/) — user i admin
- [Makiety ekranów](docs/views/screens.md)
- [API](docs/api/README.md) — endpointy + OpenAPI

**Swagger UI:** `http://localhost:3000/api-docs` (po uruchomieniu backendu)

## Struktura repo

```
FoodOrder/
├── backend/     # Express API, Mongoose, Stripe
├── frontend/    # React SPA
└── docs/        # Dokumentacja techniczna
```
