# Sekwencja: składanie zamówienia

```mermaid
sequenceDiagram
    actor U as Użytkownik
    participant ML as MealsList
    participant CC as CartContext
    participant CV as CartView
    participant VC as ViewContext
    participant CH as CheckoutView
    participant API as POST /api/orders
    participant DB as MongoDB

    U->>ML: Dodaj do koszyka
    ML->>CC: addItem({ id, name, price })
    CC->>CC: localStorage.cart

    U->>CV: Do kasy
    alt niezalogowany
        CV->>VC: openWithIntent(LOGIN, CART)
        Note over VC: po login → resolveIntent → CART
    end

    U->>CH: Dane dostawy + Złóż zamówienie
    CH->>API: { items[{ mealId, quantity }], customer }
    API->>API: validateCustomer, validateObjectId
    API->>DB: Meal.find (snapshot name, price)
    API->>DB: Order.create (pending, unpaid)
    API-->>CH: Order
    CH->>CC: clear()
    CH->>CH: SuccessModal → ORDERS
```

## Co robi backend przy `createOrder`

1. Waliduje `customer` (name, email, street, postalCode, city).
2. Pobiera `Meal` po `mealId` — odrzuca nieistniejące.
3. Liczy `totalPrice`, kopiuje `name` i `price` do `items[]`.
4. Zapisuje `Order` z `status: pending`, `paymentStatus: unpaid`.

Koszyk po stronie klienta nie jest weryfikowany cenowo — backend bierze aktualne ceny z bazy danych
