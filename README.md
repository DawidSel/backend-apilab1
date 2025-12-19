# TODO API - Menadżer Zadań

**Autor:** Dawid Selonka

**Grupa:** INMN2(hybryda)_PAW2

**Data:** 19.12.2025

## Opis projektu

REST API dla menadżera zadań z zapisem do pliku JSON. API pozwala na zarządzanie zadaniami (TODO list) poprzez standardowe operacje CRUD. Wszystkie dane są przechowywane w pliku `data/tasks.json`.

## Technologie

- Node.js
- Express.js
- JSON (do przechowywania danych)

## Instalacja i uruchomienie

### Wymagania

- Node.js (wersja 14.0.0 lub nowsza)
- npm (zazwyczaj dołączony do Node.js)

### Krok po kroku

```bash
# 1. Sklonuj repozytorium
git clone [URL_TWOJEGO_REPO]

# 2. Przejdź do katalogu
cd backend-apilab1

# 3. Zainstaluj zależności
npm install

# 4. Uruchom serwer
npm start
```

Serwer będzie dostępny pod adresem: `http://localhost:3000`

## Dostępne endpointy

- **GET /health** - Sprawdzenie statusu API
- **GET /tasks** - Pobranie wszystkich zadań
- **POST /tasks** - Dodanie nowego zadania
- **PUT /tasks/:id** - Aktualizacja zadania
- **DELETE /tasks/:id** - Usunięcie zadania

## Struktura danych

Zadanie (Task) zawiera następujące pola:
- `id` - unikalny identyfikator (automatycznie generowany)
- `title` - tytuł zadania (wymagane)
- `description` - opis zadania (opcjonalne)
- `completed` - status wykonania (domyślnie `false`)
- `createdAt` - data utworzenia (automatycznie ustawiana)
- `updatedAt` - data ostatniej aktualizacji (dodawana przy modyfikacji)

## Przykłady użycia

### Dodanie zadania
```bash
POST http://localhost:3000/tasks
Content-Type: application/json

{
  "title": "Zrobić zakupy",
  "description": "Mleko, chleb, masło"
}
```

### Aktualizacja zadania
```bash
PUT http://localhost:3000/tasks/1
Content-Type: application/json

{
  "completed": true
}
```

### Usunięcie zadania
```bash
DELETE http://localhost:3000/tasks/1
```
