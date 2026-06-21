# FoodOrder – dokumentacja projektu

## Dokumentacja na GitHub

Pełna dokumentacja techniczna (diagramy UML, przepływy, API):

| Temat                                     | Link                                                                                      |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| Spis treści + zmienne środowiskowe        | [docs/README.md](../../../docs/README.md)                                                 |
| Architektura i wdrożenie                  | [docs/architecture/overview.md](../../../docs/architecture/overview.md)                   |
| Diagram klas                              | [docs/architecture/class-diagram.md](../../../docs/architecture/class-diagram.md)         |
| Moduły frontend ↔ backend                 | [docs/architecture/component-diagram.md](../../../docs/architecture/component-diagram.md) |
| Przepływ danych (DFD)                     | [docs/architecture/data-flow.md](../../../docs/architecture/data-flow.md)                 |
| Stany zamówienia                          | [docs/architecture/order-states.md](../../../docs/architecture/order-states.md)           |
| Sekwencje (auth, checkout, Stripe, admin) | [docs/diagrams/sequences/](../../../docs/diagrams/sequences/)                             |
| Ścieżki user / admin                      | [docs/diagrams/activity/](../../../docs/diagrams/activity/)                               |
| Makiety ekranów                           | [docs/views/screens.md](../../../docs/views/screens.md)                                   |
| API + OpenAPI                             | [docs/api/README.md](../../../docs/api/README.md)                                         |

---

## Wymagania systemowe

- **Node.js** – wersja 18+
- **MongoDB** – lokalna instalacja lub MongoDB Atlas
- **Konto Stripe** – do płatności (klucze API, webhook)
- **npm** – menedżer pakietów

---

## Struktura aplikacji

```
FoodOrder/
├── backend/                 # API i logika serwera
│   ├── docs/
│   │   └── openapi.yaml
│   ├── features/            # Moduły funkcjonalne
│   │   ├── admin/         # Panel admina (CRUD dań, zamówienia)
│   │   ├── auth/          # Rejestracja, logowanie
│   │   ├── meals/         # Lista dań
│   │   ├── orders/        # Zamówienia użytkowników
│   │   └── payments/      # Stripe Checkout, webhook
│   ├── shared/            # Współdzielone narzędzia
│   │   ├── middleware/    # auth, upload
│   │   └── utils/         # walidacja, kompresja obrazów, Swagger
│   ├── images/
│   ├── app.js
│   ├── server.js
│   ├── mongoose.js
│   └── initAdmin.js
│
├── frontend/                # Aplikacja React (SPA)
│   ├── src/
│   │   ├── app/             # App, Header, Footer, context/
│   │   ├── features/        # auth, cart, meals, orders, admin, payments
│   │   ├── shared/          # API, hooks, utils
│   │   └── ui/              # Button, View, Card, Input, Loader, Toast
│   ├── vite.config.js       # Proxy /api i /images → backend
│   └── package.json
│
└── docs/                    # Dokumentacja techniczna (diagramy UML)
```

---

## Uruchomienie aplikacji

### 1. Klonowanie i instalacja zależności

```bash
git clone <url-repozytorium>
cd FoodOrder

# Backend
cd backend
npm install

# Frontend (w osobnym terminalu)
cd ../frontend
npm install
```

### 2. Konfiguracja zmiennych środowiskowych

W katalogu **backend** utwórz plik `.env`. Pełna lista: [docs/README.md](../../../docs/README.md#zmienne-środowiskowe).

Wymagane minimum:

```env
MONGODB_URI=mongodb://localhost:27017/foodorder
JWT_SECRET=twoj-sekret
ADMIN_SECRET=haslo-admina
```

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

Przy pierwszym uruchomieniu backend tworzy konto administratora na podstawie zmiennej `ADMIN_SECRET` (hasło admina). Zaloguj się emailem `admin@test.com`, aby uzyskać dostęp do panelu administracyjnego (menu, zamówienia, dokumentacja).

---

## Dokumentacja API (Swagger / OpenAPI)

Źródło prawdy: **backend/docs/openapi.yaml** (OpenAPI 3.1). Tabela endpointów: [docs/api/README.md](../../../docs/api/README.md).

Po uruchomieniu backendu:

- **Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

W Swagger UI endpointy są pogrupowane według tagów: **Auth**, **Meals**, **Orders**, **Admin**, **Payments**, **Health**, **Static**. Można wykonać próbne wywołania po ustawieniu Bearer tokena (np. po zalogowaniu).

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

Tryb watch: `npm run test:unit`. Jednorazowe wykonanie: `npx vitest run`.
