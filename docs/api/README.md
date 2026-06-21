# API

Źródło prawdy: [`backend/docs/openapi.yaml`](../../backend/docs/openapi.yaml) (OpenAPI 3.1).

**Swagger UI:** `http://localhost:3000/api-docs` (po uruchomieniu backendu).

## Format odpowiedzi

```json
{
  "success": true,
  "data": {},
  "message": "opcjonalny komunikat"
}
```

Błędy: `success: false`, opcjonalnie `errors`.

Autoryzacja: nagłówek `Authorization: Bearer <token>`.

---

## Endpointy

### Health & static

| Metoda | Ścieżka              | Auth | Opis               |
| ------ | -------------------- | ---- | ------------------ |
| GET    | `/api/health`        | —    | Status serwera     |
| GET    | `/images/{filename}` | —    | Zdjęcia dań (webp) |

### Auth — `/api/auth`

| Metoda | Ścieżka     | Auth | Opis                     |
| ------ | ----------- | ---- | ------------------------ |
| POST   | `/register` | —    | Rejestracja → JWT + user |
| POST   | `/login`    | —    | Logowanie → JWT + user   |
| GET    | `/current`  | user | Profil zalogowanego      |

### Meals — `/api/meals`

| Metoda | Ścieżka | Auth | Opis                |
| ------ | ------- | ---- | ------------------- |
| GET    | `/`     | —    | Publiczna lista dań |

### Orders — `/api/orders`

| Metoda | Ścieżka       | Auth | Opis                          |
| ------ | ------------- | ---- | ----------------------------- |
| GET    | `/`           | user | Zamówienia użytkownika        |
| POST   | `/`           | user | Nowe zamówienie               |
| PUT    | `/:id/cancel` | user | Anulowanie (pending + unpaid) |

### Admin — `/api/admin`

| Metoda | Ścieżka              | Auth  | Opis                               |
| ------ | -------------------- | ----- | ---------------------------------- |
| GET    | `/meals`             | admin | Lista dań                          |
| POST   | `/meals`             | admin | Utworzenie dania                   |
| PUT    | `/meals/:id`         | admin | Aktualizacja metadanych            |
| PUT    | `/meals/:id/image`   | admin | Upload zdjęcia (multipart `image`) |
| DELETE | `/meals/:id`         | admin | Usunięcie dania + plików           |
| GET    | `/orders`            | admin | Wszystkie zamówienia               |
| PUT    | `/orders/:id/status` | admin | Zmiana `status`                    |

### Payments — `/api/payments`

| Metoda | Ścieżka              | Auth             | Opis                                |
| ------ | -------------------- | ---------------- | ----------------------------------- |
| POST   | `/checkout/:orderId` | user             | Stripe Checkout → `{ checkoutUrl }` |
| POST   | `/webhook`           | Stripe signature | Obsługa zdarzeń Stripe              |

---

## Różnice OpenAPI vs kod

| OpenAPI                                  | Implementacja                      |
| ---------------------------------------- | ---------------------------------- |
| `POST /payments/checkout-session` + body | `POST /payments/checkout/:orderId` |
| brak `PUT /orders/:id/cancel`            | zaimplementowany                   |

Przy testowaniu przez Swagger używaj ścieżek z tabeli powyżej.

## Diagramy powiązane

- [Auth](../diagrams/sequences/auth.md)
- [Checkout](../diagrams/sequences/order-checkout.md)
- [Stripe](../diagrams/sequences/payment-stripe.md)
- [Admin CRUD](../diagrams/sequences/admin-meal-crud.md)
- [Stany zamówienia](../architecture/order-states.md)
