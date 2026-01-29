En väderhemsida där det går att skriva in en stad och få aktuell väderinformation från en vädertjänst via ett API.

Man får också se rymdväder baserat på staden man sökte efter, en random katt-bild, en random quote, samt att sidan rapporterar till ett statistik-API vilken stad som söktes på. Om ett visst väder genererar varning får man också veta via ett speciellt api.

De apier som används för detta är följande:

Weather API:

GET /api/weather?city={cityName}&date={YYYY-MM-DD}

json:
{ 
    "date": "2024-06-01", 
    "temperature": 22, 
    "description": "Soligt", 
    "windSpeed": 5, 
    "longitude": 18.0649, 
    "latitude": 59.3326 
}

WarningsAPI:

TBA

CatAPI:

GET /api/cats - Random cat image

Json:

{
  "Url": "https://upload.wikimedia.org/wikipedia/commons/c/c2/Ragdoll%2C_seal_mitted.JPG",
  "Description": "Nice ragdoll kitty"
}

QuotesAPI:

GET /api/quote

JSON:
{
  "id": 1,
  "text": "Efter regn kommer… mer regn. Men också erfarenhet."
}

StatisticsAPI:

POST /api/stats

{ "Name": "stad" }

AdsAPI:

GET /api/ad/{lon}/{lat}

JSON:
{
    "title": "MalmöFF",
    "description": "Malmös nya maychtröja!!",
    "imageUrl": "malmoff.jpg",
    "linkUrl": "malmoff.html"
}