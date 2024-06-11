const Username = require('../models/username');

exports.checkUsername = async (req, res) => {
  const { username } = req.query;
  try {
    const existingUser = await Username.findOne({ username });
    if (existingUser) {
      res.json({ unique: false });
    } else {
      res.json({ unique: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addUsername = async (req, res) => {
  const { username } = req.query;
  try {
    const newUser = new Username({ username });
    await newUser.save();
    res.json({ message: 'Username added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
