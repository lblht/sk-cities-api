# API for cities in Slovakia.

Available on: https://sk-cities-api.onrender.com

For all the cities get '/all'. For a random city get '/random'.
You can also filter the results using county or region.
Example: '/all?region=Trnavský' returns all cities in the Trnava region.
Response is available in two formats, JSON or GEOJSON. JSON is the default, for GEOJSON use 'format=geojson'.
Example: '/random?county=Pezinok&format=geojson' returns a random city in the Pezinok county in GEOJSON format.
