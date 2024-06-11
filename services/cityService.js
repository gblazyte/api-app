const axios = require('axios');
const ROME_CITY_ID = 'Q220'; // WikiData ID for Rome

async function fetchNearbyCities(cityId) {
  const options = {
    method: 'GET',
    url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${cityId}/nearbyCities`,
    params: {
      radius: 100,
      distanceUnit: 'MI',
      minPopulation: 40000,
      types: 'CITY',
      sort: 'population',
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response from GeoDB API');
    }
    const citiesData = response.data.data.slice(0, 10);
    return citiesData.map((city) => ({ id: city.wikiDataId, name: city.name }));
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

async function fetchDistanceToRome(cityId) {
  const options = {
    method: 'GET',
    url: `https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${cityId}/distance`,
    params: { toCityId: ROME_CITY_ID },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error('Rate limit exceeded:', error.message);
      throw new Error('Rate limit exceeded, please try again later.');
    } else {
      console.error('Error fetching distance:', error.message);
      throw new Error('Failed to fetch distance');
    }
  }
}

module.exports = {
  fetchNearbyCities,
  fetchDistanceToRome,
};
