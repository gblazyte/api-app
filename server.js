const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config();

const app = express();
const port = process.env.PORT || 3009;
const ROME_CITY_ID = 'Q220'; // WikiData ID for Rome

// MongoDB connection URI and client
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Middleware to serve static files
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}

// Route to get nearby cities
app.get('/cityinfo', async (req, res) => {
  const cityId = req.query.cityId;
  try {
    const nearbyCities = await getNearbyCities(cityId);
    res.json({ cities: nearbyCities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get nearby cities (duplicate, consider removing or merging with the above route)
app.get('/nearby', async (req, res) => {
  const cityId = req.query.cityId;
  try {
    const citiesData = await getNearbyCities(cityId);
    res.json({ cities: citiesData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get distance to Rome
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

// Route to save game data
app.post('/save-game', async (req, res) => {
  const gameData = req.body;
  try {
    const db = client.db('game-database'); // Replace with your database name
    const gamesCollection = db.collection('games'); // Replace with your collection name
    await gamesCollection.insertOne(gameData);
    res.status(201).json({ message: 'Game saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save game data' });
  }
});

// Route to get the leaderboard
app.get('/leaderboard', async (req, res) => {
  try {
    const db = client.db('game-database'); // Replace with your database name
    const gamesCollection = db.collection('games'); // Replace with your collection name
    const topGames = await gamesCollection.find().sort({ steps: 1 }).limit(10).toArray();
    res.json(topGames);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Function to get nearby cities
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

// Start the server and connect to MongoDB
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectToMongoDB();
});
