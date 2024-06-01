const express = require('express');
const https = require('https');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

let cityId;

app.use(express.static('public'));

app.get('/test', async (req, res) => {
    const options = {
        method: 'GET',
        hostname: 'wft-geo-db.p.rapidapi.com',
        port: null,
        path: '/v1/geo/cities/Q60',
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    try {
        const response = await new Promise((resolve, reject) => {
            const reqHttps = https.request(options, (resHttps) => {
                let body = '';

                resHttps.on('data', (chunk) => {
                    body += chunk;
                });

                resHttps.on('end', () => {
                    resolve(JSON.parse(body));
                });
            });

            reqHttps.on('error', (e) => {
                reject(e);
            });

            reqHttps.end();
        });

        cityId = response.data.wikiDataId; // Access the city id property directly from the response

        res.setHeader('Content-Type', 'application/json');
        res.send(response); // Send the response containing the city info
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


app.get('/nearby', async (req, res) => {
    const options = {
        method: 'GET',
        url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${cityId}/nearbyCities`,
        params: { radius: '100' },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const citiesData = response.data.data; // Extract data array from the response
        const cityNames = citiesData.map(city => city.name); // Extract city names




        res.setHeader('Content-Type', 'application/json');
        res.send({ cities: cityNames }); // Send city names as part of the response;
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
