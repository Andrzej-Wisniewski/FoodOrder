# Dokumentacja FoodOrder

## Spis treści

### Architektura

| Dokument                                                  | Opis                                          |
| --------------------------------------------------------- | --------------------------------------------- |
| [overview.md](architecture/overview.md)                   | Diagram wdrożenia, warstwy systemu            |
| [class-diagram.md](architecture/class-diagram.md)         | Modele Mongoose, konteksty React, warstwa API |
| [component-diagram.md](architecture/component-diagram.md) | Moduły `features/` frontend ↔ backend         |
| [data-flow.md](architecture/data-flow.md)                 | Data flow                                     |
| [order-states.md](architecture/order-states.md)           | Stany `status` i `paymentStatus`              |

### Diagramy

| Dokument                                                    | Opis                      |
| ----------------------------------------------------------- | ------------------------- |
| [auth.md](diagrams/sequences/auth.md)                       | Rejestracja i logowanie   |
| [order-checkout.md](diagrams/sequences/order-checkout.md)   | Składanie zamówienia      |
| [payment-stripe.md](diagrams/sequences/payment-stripe.md)   | Płatność Stripe + webhook |
| [admin-meal-crud.md](diagrams/sequences/admin-meal-crud.md) | Admin: CRUD dań           |
| [user.md](diagrams/activity/user.md)                        | Ścieżka użytkownika       |
| [admin.md](diagrams/activity/admin.md)                      | Ścieżka administratora    |

### Pozostałe

| Dokument                       | Opis                        |
| ------------------------------ | --------------------------- |
| [screens.md](views/screens.md) | Makiety ekranów             |
| [api/README.md](api/README.md) | Tabela endpointów + OpenAPI |

---

## Zmienne środowiskowe

Plik `.env` w katalogu `backend/`.

| Zmienna                 | Wymagana      | Opis                                               |
| ----------------------- | ------------- | -------------------------------------------------- |
| `MONGODB_URI`           | tak           | Connection string MongoDB (baza: `foodorder`)      |
| `JWT_SECRET`            | tak           | Klucz do podpisywania JWT                          |
| `ADMIN_SECRET`          | tak           | Hasło konta admina (`admin@test.com`)              |
| `PORT`                  | nie           | Port serwera (domyślnie `3000`)                    |
| `STRIPE_SECRET_KEY`     | nie\*         | Klucz Stripe — bez niego płatności zwracają 503    |
| `STRIPE_WEBHOOK_SECRET` | dla webhooków | Weryfikacja podpisu Stripe                         |
| `FRONTEND_URL`          | dla płatności | URL powrotu z Stripe (np. `http://localhost:5173`) |
| `VITE_API_URL`          | nie           | Nadpisanie bazowego URL obrazków w frontendzie     |

\*Płatności wymagają `STRIPE_SECRET_KEY` + `FRONTEND_URL`.

## Uruchomienie

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (osobny terminal)
cd frontend && npm install && npm run dev
```

Testy backendu: `cd backend && npm run test:unit`
