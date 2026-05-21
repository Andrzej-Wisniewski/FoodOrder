# FoodOrder – dokumentacja projektu

---

## Wymagania systemowe

- **Node.js** – wersja 18+
- **MongoDB** – lokalna instalacja lub MongoDB Atlas
- **Konto Stripe** – do płatności (klucze API, webhook)
- **npm** – menedżer pakietów

---

## Struktura aplikacji

```
FoodOrderAppMain/
├── backend/                 # API i logika serwera
│   ├── docs
│   │   └── openapi.yaml
│   ├── features/            # Moduły funkcjonalne
│   │   ├── admin/           # Panel admina (CRUD dań, zamówienia)
│   │   ├── auth/            # Rejestracja, logowanie
│   │   ├── meals/           # Lista dań
│   │   ├── orders/          # Zamówienia użytkowników
│   │   └── payments/        # Stripe Checkout, webhook
│   ├── shared/              # Współdzielone narzędzia
│   │   ├── middleware/      # auth, upload
│   │   └── utils/           # walidacja, kompresja obrazów, Swagger
│   ├── docs/                # OpenAPI (openapi.yaml)
│   ├── images
│   ├── app.js               # Konfiguracja Express, trasy
│   ├── server.js            # Uruchomienie serwera, MongoDB
│   ├── mongoose.js          # Połączenie z MongoDB
│   ├── package.json
│   └── initAdmin.js         # Tworzenie konta admina przy starcie
│
├── frontend/                # Aplikacja React (SPA)
│   ├── src/
│   │   ├── app/             # App, Header, Footer
│   │   │   ├── context/     # AuthContext, CartContext, ViewContext, ToastContext
│   │   │   └── documentation/
│   │   ├── features/        # Moduły po funkcji
│   │   │   ├── auth/        # Logowanie, rejestracja
│   │   │   ├── cart/        # Koszyk
│   │   │   ├── meals/       # Lista dań, panel admina dań
│   │   │   ├── orders/      # Zamówienia, formularz płatności
│   │   │   └── payments/    # Przycisk płatności Stripe
│   │   ├── shared/          # API (httpClient, payments), useLocalStorage, utils
│   │   └── ui/              # Button, View, Card, Input, Loader, Toast
│   ├── index.html
│   ├── index.css
│   ├── public
│   │   └── images
│   ├── package.json
│   └── vite.config.js       # Proxy /api i /images → backend
│
└── documentation.md        # Ten plik
```

---

## Uruchomienie aplikacji

### 1. Klonowanie i instalacja zależności

```bash
# W katalogu projektu
cd "FoodOrderAppMain copy"

# Backend
cd backend
npm install

# Frontend (w osobnym terminalu lub po powrocie do roota)
cd ../frontend
npm install
```

### 2. Konfiguracja zmiennych środowiskowych

W katalogu **backend** utwórz plik `.env` (patrz sekcja [Zmienne środowiskowe](#zmienne-środowiskowe)) i uzupełnij wartości.

### 3. Uruchomienie backendu

```bash
cd backend
npm run dev
```

Serwer działa domyślnie na **http://localhost:3000**.

### 4. Uruchomienie frontendu

W **drugim terminalu**:

```bash
cd frontend
npm run dev
```

Aplikacja React jest dostępna pod **http://localhost:5173**. Vite proxy przekierowuje `/api` i `/images` na `http://localhost:3000`.

### 5. Pierwsze konto administratora

Przy pierwszym uruchomieniu backend tworzy konto administratora na podstawie zmiennej `ADMIN_SECRET` (hasło admina). Zaloguj się tym hasłem, aby uzyskać dostęp do panelu administracyjnego (menu, zamówienia, dokumentacja).

---

## Dokumentacja API (Swagger / OpenAPI)

Źródło prawdy dla API: **backend/docs/openapi.yaml** (OpenAPI 3.1). Opis w pliku: „API FoodOrder. Swagger UI pod /api-docs.” Na jego podstawie backend serwuje Swagger UI.

Po uruchomieniu backendu:

- **Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

W Swagger UI endpointy są pogrupowane według tagów z openapi.yaml: **Auth**, **Meals**, **Orders**, **Admin**, **Payments**, **Health**, **Static** (obrazy pod adresem bez /api, np. `http://localhost:3000/images/nazwa.jpg`). Można wykonać próbne wywołania po ustawieniu Bearer tokena (np. po zalogowaniu).

---

## Testy jednostkowe (backend)

W backendzie (Vitest) są testy dla modułów z **backend/shared/utils**:

- **validateEmail** – walidacja adresu e-mail
- **response** – helpery odpowiedzi HTTP (success, badRequest, created, itd.)
- **validateObjectId** – walidacja MongoDB ObjectId

Uruchomienie testów:

```bash
cd backend
npm run test:unit
```

Tryb watch (przy zmianach): `npm run test:unit` uruchamia Vitest w trybie watch; jednorazowe wykonanie: `npx vitest run`.

---
