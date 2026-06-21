# Stany zamówienia

Zamówienie ma **dwa niezależne wymiary** stanu:

| Pole            | Wartości                                          | Kto zmienia                                 |
| --------------- | ------------------------------------------------- | ------------------------------------------- |
| `status`        | `pending`, `completed`, `cancelled`               | user (anulowanie), admin, webhook (expired) |
| `paymentStatus` | `unpaid`, `paid`, `failed`, `expired`, `refunded` | Stripe webhook                              |

Przy tworzeniu: `status: pending`, `paymentStatus: unpaid`.

---

## status — realizacja zamówienia

```mermaid
stateDiagram-v2
    [*] --> pending : POST /api/orders

    pending --> cancelled : PUT /orders/:id/cancel\n(user, unpaid only)
    pending --> completed : PUT /admin/orders/:id/status\n(admin)
    pending --> cancelled : webhook checkout.session.expired

    completed --> [*]
    cancelled --> [*]

    note right of pending
        Admin może też ustawić cancelled
        przez PUT /admin/orders/:id/status
    end note
```

**Warunki anulowania przez użytkownika** (`cancelOrder`):

- `status === 'pending'`
- `paymentStatus === 'unpaid'`
- zamówienie należy do zalogowanego usera

---

## paymentStatus — płatność

```mermaid
stateDiagram-v2
    [*] --> unpaid : POST /api/orders

    unpaid --> paid : webhook checkout.session.completed
    unpaid --> expired : webhook checkout.session.expired

    paid --> refunded : webhook charge.refunded

    note right of unpaid
        failed — tylko log w backendzie
        (payment_intent.payment_failed),
        paymentStatus w DB się nie zmienia
    end note

    paid --> [*]
    expired --> [*]
    refunded --> [*]
```

Webhook `checkout.session.expired` ustawia jednocześnie `paymentStatus: expired` **i** `status: cancelled`.

---

## Diagram współbieżny (kombinacje stanów)

```mermaid
stateDiagram-v2
    state "pending + unpaid" as PU
    state "pending + paid" as PP
    state "completed + paid" as CP
    state "cancelled + unpaid" as CU
    state "cancelled + expired" as CE
    state "completed + refunded" as CR

    [*] --> PU : utworzenie zamówienia

    PU --> PP : Stripe: session.completed
    PU --> CU : user anuluje
    PU --> CE : Stripe: session.expired

    PP --> CP : admin: status=completed
    PP --> CR : Stripe: charge.refunded

    note right of PU
        Typowy stan po checkout —
        czeka na płatność
    end note

    note right of PP
        Opłacone, w realizacji —
        admin oznacza completed
    end note

    note right of CE
        Sesja Stripe wygasła —
        oba pola zmienione naraz
    end note
```

## Tabela kombinacji

| status      | paymentStatus | Znaczenie                     | Typowy następny krok |
| ----------- | ------------- | ----------------------------- | -------------------- |
| `pending`   | `unpaid`      | Nowe zamówienie               | Zapłać lub anuluj    |
| `pending`   | `paid`        | Opłacone, czeka na realizację | Admin → `completed`  |
| `completed` | `paid`        | Zrealizowane i opłacone       | —                    |
| `cancelled` | `unpaid`      | Anulowane przed płatnością    | —                    |
| `cancelled` | `expired`     | Sesja Stripe wygasła          | —                    |
| `completed` | `refunded`    | Zwrot po realizacji           | —                    |
