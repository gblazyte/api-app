const express = require('express');
const https = require('https');

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Endpoint to handle the test request
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
            const body = Buffer.concat(chunks);
            res.send(body.toString());
        });
    });

    reqHttps.on('error', function (e) {
        res.status(500).send('Error: ' + e.message);
    });

    reqHttps.end();
});

// Start the server and log a message to the console
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
