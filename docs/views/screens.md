# Makiety ekranów

Nawigacja przez `ViewContext.currentScreen` — widoki jako overlay na `MealsList`.

## Mapa nawigacji

```mermaid
flowchart TB
    subgraph Public
        M[MealsList]
        L[LoginView]
        R[RegisterView]
        C[CartView]
    end

    subgraph User
        CH[CheckoutView]
        O[OrdersView]
    end

    subgraph Admin
        MA[MealAdminView]
        MC[MealCreateView]
        AO[OrdersView admin]
        D[Documentation]
    end

    M --> C --> CH --> O
    C -.-> L
    L --> C
    M --> MA
    MA --> MC
    MA --> AO
    MA --> D
```

---

## MealsList (domyślny)

```
┌─────────────────────────────────────────────┐
│  HEADER  [Zaloguj] [Rejestracja]  [Koszyk]  │
├─────────────────────────────────────────────┤
│  [Przystawka] [Zupa] [Danie główne] ...     │
├─────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ [img]   │  │ [img]   │  │ [img]   │     │
│  │ Nazwa   │  │ Nazwa   │  │ Nazwa   │     │
│  │ opis    │  │ opis    │  │ opis    │     │
│  │ 24,00 zł│  │ 18,00 zł│  │ 32,00 zł│     │
│  │[Dodaj]  │  │[Dodaj]  │  │[Dodaj]  │     │
│  └─────────┘  └─────────┘  └─────────┘     │
└─────────────────────────────────────────────┘
```

---

## CartView

```
┌─────────────────────────────────────────────┐
│  KOSZYK                              [X]    │
├─────────────────────────────────────────────┤
│  Pizza Margherita    [-] 2 [+]     48,00 zł │
│  Zupa pomidorowa     [-] 1 [+]     12,00 zł │
├─────────────────────────────────────────────┤
│  Suma:                         60,00 zł     │
│                    [Przejdź do kasy]        │
└─────────────────────────────────────────────┘
```

---

## CheckoutView

```
┌─────────────────────────────────────────────┐
│  DANE DOSTAWY                        [X]    │
├─────────────────────────────────────────────┤
│  Imię i nazwisko  [________________]        │
│  Email            [________________]        │
│  Ulica            [________________]        │
│  Kod pocztowy     [______]  Miasto [______] │
├─────────────────────────────────────────────┤
│  Podsumowanie: 2 pozycje, 60,00 zł          │
│                    [Złóż zamówienie]        │
└─────────────────────────────────────────────┘
```

---

## OrdersView (user)

```
┌─────────────────────────────────────────────┐
│  MOJE ZAMÓWIENIA                     [X]    │
├─────────────────────────────────────────────┤
│  #abc123  21.06.2026  pending / unpaid      │
│  Pizza x2, Zupa x1              60,00 zł    │
│              [Zapłać]  [Anuluj]             │
├─────────────────────────────────────────────┤
│  #def456  20.06.2026  completed / paid       │
│  ...                            45,00 zł    │
└─────────────────────────────────────────────┘
```

---

## MealAdminView (admin)

```
┌─────────────────────────────────────────────┐
│  HEADER  [Zamówienia] [Menu] [Wyloguj]      │
├─────────────────────────────────────────────┤
│  ZARZĄDZANIE DANIAMI        [+ Nowe danie]  │
├─────────────────────────────────────────────┤
│  [img] Pizza Margherita  24zł  Danie główne │
│                    [Edytuj] [Usuń]          │
│  [img] Zupa pomidorowa   12zł  Zupa          │
│                    [Edytuj] [Usuń]          │
├─────────────────────────────────────────────┤
│  FOOTER  [Dokumentacja techniczna]          │
└─────────────────────────────────────────────┘
```

---

## MealCreateView (admin)

```
┌─────────────────────────────────────────────┐
│  NOWE DANIE                          [X]    │
├─────────────────────────────────────────────┤
│  Nazwa        [________________]            │
│  Opis         [________________]            │
│  Cena         [____]  Kategoria [v]         │
│                    [Utwórz]                 │
├─────────────────────────────────────────────┤
│  Krok 2: Zdjęcie                            │
│  [Wybierz plik]  [Wyślij]                  │
└─────────────────────────────────────────────┘
```

---

## LoginView / RegisterView

```
┌─────────────────────────────────────────────┐
│  LOGOWANIE                           [X]    │
├─────────────────────────────────────────────┤
│  Email    [________________]                │
│  Hasło    [________________]                │
│                    [Zaloguj]                │
│  Nie masz konta? [Zarejestruj się]          │
└─────────────────────────────────────────────┘
```

RegisterView dodaje pole `Imię i nazwisko`.
