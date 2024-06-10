const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const gameLogSchema = new mongoose.Schema({
  id: { type: Number },
  username: { type: String, required: true },
  selectedCity: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

gameLogSchema.plugin(AutoIncrement, { inc_field: 'id' });

const GameLog = mongoose.model('gamelog', gameLogSchema);

module.exports = GameLog;
