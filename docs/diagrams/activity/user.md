# Ścieżka użytkownika

```mermaid
flowchart TD
    START([Wejście na stronę]) --> MENU[MealsList — przeglądanie menu]
    MENU --> ADD{Dodaj do koszyka}
    ADD --> MENU
    ADD --> CART[CartView]

    CART --> LOGIN{Zalogowany?}
    LOGIN -->|nie| AUTH[LoginView / RegisterView]
    AUTH --> CART
    LOGIN -->|tak| CHECKOUT[CheckoutView]

    CHECKOUT --> ORDER[POST /api/orders]
    ORDER --> SUCCESS[SuccessModal]
    SUCCESS --> ORDERS[OrdersView]

    ORDERS --> PAY{Zapłać?}
    PAY -->|tak| STRIPE[Stripe Checkout]
    STRIPE --> ORDERS
    PAY -->|nie| CANCEL{Anuluj?}
    CANCEL -->|tak, pending+unpaid| ORDERS
    CANCEL -->|nie| ORDERS

    ORDERS --> MENU
```

## Ekrany użytkownika

| Ekran (`VIEWS`)        | Dostęp     | Akcje                                  |
| ---------------------- | ---------- | -------------------------------------- |
| domyślny (`MealsList`) | publiczny  | przeglądanie, dodawanie do koszyka     |
| `CART`                 | publiczny  | edycja ilości, przejście do kasy       |
| `LOGIN` / `REGISTER`   | publiczny  | auth                                   |
| `CHECKOUT`             | zalogowany | formularz dostawy, złożenie zamówienia |
| `ORDERS`               | zalogowany | lista zamówień, płatność, anulowanie   |

## Dane w localStorage

| Klucz   | Zawartość                         |
| ------- | --------------------------------- |
| `token` | JWT                               |
| `user`  | `{ id, email, name, role }`       |
| `cart`  | `[{ id, name, price, quantity }]` |

Logout czyści `token`, `user` i `cart`.
