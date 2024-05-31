const express = require('express');
const https = require('https');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/test', (req, res) => {
    const options = {
        method: 'GET',
        hostname: 'wft-geo-db.p.rapidapi.com',
        port: null,
        path: '/v1/geo/cities/Q60',
        headers: {
            'X-RapidAPI-Key': '2bcd52099amshb6dade3fc472b89p137ac5jsn8d1df60702ce',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    const reqHttps = https.request(options, function (resHttps) {
        const chunks = [];

        resHttps.on('data', function (chunk) {
            chunks.push(chunk);
        });

        resHttps.on('end', function () {
            const body = Buffer.concat(chunks).toString();
            res.setHeader('Content-Type', 'application/json');
            res.send(body);
        });
    });

    reqHttps.on('error', function (e) {
        res.status(500).json({ error: e.message });
    });

    reqHttps.end();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
