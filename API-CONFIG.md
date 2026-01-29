# Weather Homepage - API Configuration

## API-portar och konfiguration

Alla API-adresser är konfigurerade på ett ställe och behöver uppdateras när du vet vilka portar dina API-servrar använder:

### Frontend-konfiguration
**Fil:** `wwwroot/js/app.js` (överst i filen)

```javascript
const API_CONFIG = {
    weatherApi: 'http://localhost:5001',
    catApi: 'http://localhost:5002',
    quoteApi: 'http://localhost:5003',
    statisticsApi: 'http://localhost:5004',
    adsApi: 'http://localhost:5005',
    warningsApi: 'http://localhost:5006'
};
```

## Hur man kör projektet

1. Uppdatera portarna i de två filerna ovan baserat på dina API-servers portar
2. Kör projektet:
   ```bash
   dotnet run
   ```
3. Öppna webbläsaren på den port som visas (vanligtvis http://localhost:5000 eller http://localhost:5273)

## API-endpoints som används

- **Weather API:** `GET /api/weather?city={cityName}&date={YYYY-MM-DD}`
- **Cat API:** `GET /api/cats`
- **Quote API:** `GET /api/quote`
- **Statistics API:** `POST /api/stats`
- **Ads API:** `GET /api/ad/{lon}/{lat}`
- **Warnings API:** TBA (ej implementerat än)

## Felhantering

Projektet innehåller omfattande felhantering som visar tydliga meddelanden till användaren om:
- API:er inte svarar
- API:er returnerar data i fel format
- Nätverksfel uppstår
- Användaren inte anger en stad

Alla felmeddelanden inkluderar information om vilken port API:et förväntas köra på för enkel felsökning.
