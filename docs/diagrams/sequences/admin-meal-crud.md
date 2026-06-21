# Sekwencja: admin CRUD dań

## Lista i edycja

```mermaid
sequenceDiagram
    actor A as Admin
    participant MAV as MealAdminView
    participant API as /api/admin/meals
    participant DB as MongoDB

    A->>MAV: Otwórz panel dań
    MAV->>API: GET /admin/meals
    API->>API: requireAuth + requireAdmin
    API->>DB: Meal.find
    API-->>MAV: meals[]

    A->>MAV: Edytuj danie
    MAV->>API: PUT /admin/meals/:id
    API->>DB: Meal.findByIdAndUpdate
    API-->>MAV: updated meal
```

## Tworzenie dania (dwa kroki)

```mermaid
sequenceDiagram
    actor A as Admin
    participant MCV as MealCreateView
    participant API as /api/admin/meals
    participant UP as multer + sharp
    participant FS as backend/images/

    A->>MCV: Formularz (bez zdjęcia)
    MCV->>API: POST /admin/meals
    API->>API: walidacja CATEGORIES
    API-->>MCV: meal { id }

    A->>MCV: Upload zdjęcia
    MCV->>API: PUT /admin/meals/:id/image (multipart)
    API->>UP: compressImage → 400/600/800 webp
    API->>FS: zapis plików
    API->>API: Meal.image = nazwa-800.webp
    API-->>MCV: meal z image
```

## Usuwanie

```mermaid
sequenceDiagram
    actor A as Admin
    participant MAI as MealAdminItem
    participant API as DELETE /api/admin/meals/:id
    participant FS as backend/images/

    A->>MAI: Usuń
    MAI->>API: DELETE
    API->>FS: usuń warianty webp
    API->>API: Meal.findByIdAndDelete
```

## Zarządzanie zamówieniami (admin)

```mermaid
sequenceDiagram
    actor A as Admin
    participant OV as OrdersView
    participant API as /api/admin/orders

    A->>OV: Lista zamówień
    OV->>API: GET /admin/orders
    API-->>OV: orders (populate user)

    A->>OV: Zmień status
    OV->>API: PUT /admin/orders/:id/status { status }
    Note over API: pending | completed | cancelled
    API-->>OV: updated order
```

Admin nie zmienia `paymentStatus` — robi to wyłącznie Stripe webhook.
