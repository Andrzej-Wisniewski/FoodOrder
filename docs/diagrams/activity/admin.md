# Ścieżka administratora

```mermaid
flowchart TD
    START([Login admin@test.com]) --> MENU[MealAdminView]

    MENU --> CREATE[MealCreateView]
    CREATE --> MENU
    MENU --> EDIT[Edycja / usuwanie dania]
    EDIT --> MENU

    MENU --> ORDERS[OrdersView — wszystkie zamówienia]
    ORDERS --> STATUS[Zmiana status realizacji]
    STATUS --> ORDERS

    MENU --> DOC[Documentation — Footer]
    DOC --> MENU
```

## Różnice vs użytkownik

| Aspekt                    | User                 | Admin                           |
| ------------------------- | -------------------- | ------------------------------- |
| Domyślny widok po loginie | `MealsList` + koszyk | `MealAdminView` (przycisk Menu) |
| Koszyk                    | widoczny             | ukryty                          |
| `OrdersView`              | własne zamówienia    | wszystkie + dane klienta        |
| Zarządzanie daniami       | brak                 | pełny CRUD + upload             |
| Dokumentacja              | brak                 | link w Footer                   |

## Konto admina

Tworzone automatycznie przy starcie (`initAdmin.js`):

- Email: `admin@test.com`
- Hasło: wartość `ADMIN_SECRET` z `.env`

```mermaid
flowchart LR
    SERVER[server.js start] --> INIT[initAdmin.js]
    INIT --> CHECK{admin istnieje?}
    CHECK -->|nie| CREATE[User.create role=admin]
    CHECK -->|tak| SKIP[pomiń]
```

## Uprawnienia

Middleware `requireAdmin` sprawdza `req.user.role === 'admin'` po weryfikacji JWT.

Wszystkie trasy `/api/admin/*` wymagają `requireAuth` + `requireAdmin`.
