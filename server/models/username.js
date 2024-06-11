const mongoose = require('mongoose');

const usernameSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
});

const Username = mongoose.model('Username', usernameSchema);

module.exports = Username;
