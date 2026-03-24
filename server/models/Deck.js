const mongoose = require("mongoose");

const DeckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  colors: { type: String, required: true },
  // You can add more fields later, like an array of Card IDs
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Deck", DeckSchema);
