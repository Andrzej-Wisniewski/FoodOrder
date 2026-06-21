# Sekwencja: płatność Stripe

```mermaid
sequenceDiagram
    actor U as Użytkownik
    participant PB as PayButton
    participant API as POST /api/payments/checkout/:orderId
    participant DB as MongoDB
    participant Stripe as Stripe Checkout
    participant WH as POST /api/payments/webhook

    U->>PB: Zapłać
    PB->>API: orderId + Bearer JWT
    API->>DB: Order.findById
    API->>API: sprawdź: owner, unpaid, pending
    API->>Stripe: checkout.sessions.create
    API->>DB: stripeSessionId
    API-->>PB: { checkoutUrl }
    PB->>Stripe: window.location = checkoutUrl

    U->>Stripe: Płatność kartą
    Stripe->>WH: checkout.session.completed
    WH->>WH: verify signature (STRIPE_WEBHOOK_SECRET)
    WH->>DB: paymentStatus = paid

    Note over U,Stripe: Powrót: FRONTEND_URL/?payment=success
```

## Webhook — obsługiwane zdarzenia

| Zdarzenie                       | Zmiana w Order                                        |
| ------------------------------- | ----------------------------------------------------- |
| `checkout.session.completed`    | `paymentStatus → paid`, zapis `stripePaymentIntentId` |
| `checkout.session.expired`      | `paymentStatus → expired`, `status → cancelled`       |
| `charge.refunded`               | `paymentStatus → refunded`                            |
| `payment_intent.payment_failed` | tylko `console.warn` — brak zmiany w DB               |

## Ważne

- Webhook montowany **przed** `express.json()` — wymaga raw body.
- Aktualizacje idempotentne: np. `paid` tylko gdy `paymentStatus === 'unpaid'`.
- Bez `STRIPE_SECRET_KEY` endpoint checkout zwraca **503**.

## Anulowanie przez użytkownika

```mermaid
sequenceDiagram
    actor U as Użytkownik
    participant CO as ClientOrderItem
    participant API as PUT /api/orders/:id/cancel

    U->>CO: Anuluj
    CO->>API: Bearer JWT
    API->>API: owner + pending + unpaid
    API-->>CO: status = cancelled
```

Szczegóły stanów: [order-states.md](../../architecture/order-states.md).
