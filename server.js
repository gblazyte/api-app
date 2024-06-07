const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3009;
const ROME_CITY_ID = 'Q220'; // WikiData ID for Rome

app.use(express.static('public'));

app.get('/cityinfo', async (req, res) => {
    const cityId = req.query.cityId;
    try {
        const nearbyCities = await getNearbyCities(cityId);
        res.json({ cities: nearbyCities });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/nearby', async (req, res) => {
    const cityId = req.query.cityId;
    try {
        const citiesData = await getNearbyCities(cityId);
        res.json({ cities: citiesData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/distance', async (req, res) => {
    const cityId = req.query.cityId;
    try {
        const options = {
            method: 'GET',
            url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${cityId}/distance`,
            params: { toCityId: ROME_CITY_ID },
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        const distance = response.data.data;
        res.json({ distance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function getNearbyCities(cityId) {
    const options = {
        method: 'GET',
        url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${cityId}/nearbyCities`,
        params: {
            radius: 100,
            distanceUnit: 'MI',
            minPopulation: 40000,
            types: 'CITY',
            sort: 'population'
        },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        if (!response.data || !response.data.data) {
            throw new Error('Invalid response from GeoDB API');
        }
        const citiesData = response.data.data.slice(0, 5);
        return citiesData.map(city => ({ id: city.wikiDataId, name: city.name }));
    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.error('Rate limit exceeded:', error.message);
            throw new Error('Rate limit exceeded, please try again later.');
        } else {
            console.error('Error fetching nearby cities:', error.message);
            throw new Error('Failed to fetch nearby cities');
        }
    }
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
