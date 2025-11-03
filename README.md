# Instrukcja

- Wpisać w terminalu polecenie: `git clone https://github.com/PaStar98/wwsi-wypozyczalnia-ksiazek`
- Przejść do folderu z repozytorium `cd wwsi-wypozyczalnia-ksiazek`
- Zainstalować zależności `npm i`
- Uruchomin projekt `npm run dev`
- Wpisać w przeglądarce adres `https://localhost:3000/`

# Testy

## Test wypożyczenia (brak egzemplarzy)

Polecenie curl do terminala:

```bash
curl -X POST "http://localhost:3000/api/loans?action=borrow" \
  -H "Content-Type: application/json" \
  -d '{
    "member_id": 1,
    "book_id": 1,
    "days": 14
  }'
```

## Dodanie/zwrot aktualizuje liczby bez restartu aplikacji.

1. Przejść do widoku https://localhost:3000/loans
2. Kliknąć przycisk 'Zwróć'
3. Zweryfikować, że liczba książek została zaktualizowana bez restartu aplikacji

## Email członka jest unikalny (drugi insert → 409/400).

Polecenie curl do terminala:

```bash
curl -X POST "http://localhost:3000/api/members" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "patryk",
    "email": "test@test.test"
  }'
```
