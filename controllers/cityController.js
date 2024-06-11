const cityService = require('../services/cityService');
const GameLog = require('../models/gameLog');

exports.getNearbyCities = async (req, res) => {
  const { cityId, username, cityName } = req.query;

  const gameLog = new GameLog({
    username,
    selectedCity: cityName,
  });
  await gameLog.save();

  try {
    const nearbyCities = await cityService.fetchNearbyCities(cityId);
    res.json({ cities: nearbyCities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDistance = async (req, res) => {
  const cityId = req.query.cityId;
  try {
    const distance = await cityService.fetchDistanceToRome(cityId);
    res.json({ distance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Not being used ???????????????
// exports.getNearbyCities = async (req, res) => {
//   const cityId = req.query.cityId;
//   try {
//     const citiesData = await cityService.fetchNearbyCities(cityId);
//     res.json({ cities: citiesData });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
