import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import fs from "fs";

const app = express();
const PORT = 5000;

let citiesGeojson;
let citiesJson;

fs.readFile('slovakia-cities.geojson', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    citiesGeojson = JSON.parse(data);
    citiesJson = citiesGeojson.features.map(feature => feature.properties);
});

app.use(bodyParser.json(), cors());

app.get('/', (req, res) => {
    res.send("<p><b>This is an API that returns cities in Slovakia.</b></p><p><br>For all the cities get '/all'. For a random city get '/random'.<br>You can also filter the results using county or region.<br>Example: '/all?region=Trnavský' returns all cities in the Trnava region.<br>Response is available in two formats, JSON or GEOJSON. JSON is the default, for GEOJSON use 'format=geojson'.<br>Example: '/random?county=Pezinok&format=geojson' returns a random city in the Pezinok county in GEOJSON format.</p>")
}); 

const filterCities = (req) => {
    const { county, region, format } = req.query;
    let filteredCities;

    if (format === 'geojson') {
        if (county) { filteredCities = citiesGeojson.features.filter(city => city.properties.county === county); } 
        else if (region) { filteredCities = citiesGeojson.features.filter(city => city.properties.region === region); } 
        else { filteredCities = citiesGeojson.features }
    }
    else {
        if (county) { filteredCities = citiesJson.filter(city => city.county === county); } 
        else if (region) { filteredCities = citiesJson.filter(city => city.region === region); } 
        else { filteredCities = citiesJson }
    }

    return filteredCities;
}

app.get('/all', (req, res) => {
    const { format } = req.query;
    let cities = filterCities(req);
    if (cities.length === 0) { res.status(400).send({ error: 'Incorrect filter values (county or region). No cities found.' }); return; }
    if (format === 'geojson') { res.send({type: "FeatureCollection", crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } }, features: cities }); } 
    else { res.send(cities); }
});

app.get('/random', (req, res) => {
    const { format } = req.query;
    let cities = filterCities(req);
    console.log(cities);
    if (cities.length === 0) { res.status(400).send({ error: 'Incorrect filter values (county or region). No cities found.' }); return; }
    if (format === 'geojson') { res.send({type: "FeatureCollection", crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } }, features: [cities[Math.floor(Math.random() * cities.length)]] }); } 
    else { res.send(cities[Math.floor(Math.random() * cities.length)]); }
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));