# Przepływ danych (DFD)

## Poziom 0 — kontekst systemu

```mermaid
flowchart LR
    U([Użytkownik])
    A([Administrator])
    S([Stripe])

  U <-->|przeglądanie, koszyk, zamówienia| SYS[FoodOrder]
  A <-->|CRUD dań, zarządzanie zamówieniami| SYS
  S -->|webhook płatności| SYS
  SYS -->|redirect checkout| S
```

## Poziom 1 — procesy i magazyny

```mermaid
flowchart TB
    subgraph Wejścia
        U1[Użytkownik: wybór dań]
        U2[Użytkownik: dane dostawy]
        U3[Użytkownik: login/register]
        A1[Admin: dane dania + zdjęcie]
        A2[Admin: zmiana statusu]
        S1[Stripe: zdarzenia webhook]
    end

    subgraph Procesy
        P1[P1: Menu]
        P2[P2: Koszyk]
        P3[P3: Auth JWT]
        P4[P4: Zamówienie]
        P5[P5: Płatność]
        P6[P6: Panel admina]
    end

    subgraph Magazyny
        D1[(D1: Meals)]
        D2[(D2: Users)]
        D3[(D3: Orders)]
        D4[(D4: localStorage)]
        D5[(D5: images/)]
    end

    U1 --> P1
    P1 <--> D1
    U1 --> P2
    P2 <--> D4
    U3 --> P3
    P3 <--> D2
    U2 --> P4
    P4 --> D3
    P4 --> D1
    P5 <--> D3
    S1 --> P5
    P5 --> S1
    A1 --> P6
    A2 --> P6
    P6 <--> D1
    P6 <--> D3
    P6 --> D5
    P1 --> D5
```

## Przepływ zamówienia (skrót)

1. **Menu** — `GET /api/meals` → odczyt `D1`.
2. **Koszyk** — zapis w `D4`, bez backendu.
3. **Checkout** — `POST /api/orders` → zapis w `D3` (snapshot pozycji z `D1`).
4. **Płatność** — `POST /api/payments/checkout/:id` → Stripe → webhook → aktualizacja `paymentStatus` w `D3`.

## Format odpowiedzi API

Wszystkie endpointy zwracają envelope:

```json
{
  "success": true,
  "data": {},
  "message": "..."
}
```

`httpClient` na frontendzie rozpakowuje pole `data`.
