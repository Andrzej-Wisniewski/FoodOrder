# Sekwencja: Uwierzytelnianie

## Rejestracja

```mermaid
sequenceDiagram
    actor U as Użytkownik
    participant LV as RegisterView
    participant AC as AuthContext
    participant API as POST /api/auth/register
    participant DB as MongoDB

    U->>LV: name, email, password
    LV->>AC: register()
    AC->>API: { name, email, password }
    API->>API: validateEmail, bcrypt.hash
    API->>DB: User.create (role: user)
    API-->>AC: { token, user }
    AC->>AC: localStorage ← token, user
    AC->>AC: resolveIntent() jeśli był
```

## Logowanie

```mermaid
sequenceDiagram
    actor U as Użytkownik
    participant LV as LoginView
    participant AC as AuthContext
    participant API as POST /api/auth/login
    participant DB as MongoDB

    U->>LV: email, password
    LV->>AC: login()
    AC->>API: { email, password }
    API->>DB: User.findOne({ email })
    API->>API: bcrypt.compare
    API-->>AC: { token (JWT 1h), user }
    AC->>AC: localStorage ← token, user
```

## Weryfikacja sesji (każde odświeżenie)

```mermaid
sequenceDiagram
    participant AC as AuthContext
    participant HC as httpClient
    participant API as GET /api/auth/current
    participant MW as requireAuth

    AC->>API: Bearer token
    API->>MW: jwt.verify(JWT_SECRET)
    MW->>MW: req.user = { id, role }
    API-->>AC: { user }
    AC->>AC: odśwież user w localStorage

    alt token wygasł / nieprawidłowy
        API-->>HC: 401
        HC->>HC: clear localStorage
        HC->>HC: window.location.reload()
    end
```

## JWT payload

```json
{ "id": "<userId>", "role": "user" | "admin" }
```

Ważność: **1 godzina**.

## Intent-based navigation

Gdy checkout wymaga logowania, `ViewContext.openWithIntent(LOGIN, CART)` otwiera login i po sukcesie `resolveIntent()` wraca do koszyka.
