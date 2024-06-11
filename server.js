const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

const cityController = require('./controllers/cityController');
const usernameController = require('./controllers/usernameController');

dotenv.config();

const app = express();
const port = process.env.PORT || 3009;

app.use(express.static('public'));

// Initialize MongoDB connection
connectDB();

app.get('/nearbyCities', cityController.getNearbyCities);
app.get('/distance', cityController.getDistance);
// Not being used ???????????????
// app.get('/nearby', cityController.getNearbyCities);

// New endpoints for username checking and addition
app.get('/checkUsername', usernameController.checkUsername);
app.post('/addUsername', usernameController.addUsername);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
