// server/models/Card.js
let mongoose = require("mongoose");

let CardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  manaValue: { type: Number, required: true },
  price: { type: String, default: "0.00" }, // Added for Scryfall data
  imageUrl: { type: String }, // Added for visual deck view
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Card", CardSchema);
