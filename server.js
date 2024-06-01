const express = require('express');
const https = require('https');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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
        const body = await new Promise((resolve, reject) => {
            const reqHttps = https.request(options, (resHttps) => {
                const chunks = [];

                resHttps.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                resHttps.on('end', () => {
                    const body = Buffer.concat(chunks).toString();
                    resolve(body);
                });
            });

            reqHttps.on('error', (e) => {
                reject(e);
            });

            reqHttps.end();
        });

        res.setHeader('Content-Type', 'application/json');
        res.send(body);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


app.get('/nearby', async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities/Q60/nearbyCities',
        params: { radius: '100' },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.setHeader('Content-Type', 'application/json');
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
