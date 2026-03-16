// server/models/Card.js
let mongoose = require("mongoose");

let CardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  manaValue: { type: Number, required: true },
  price: { type: String, default: "0.00" },
  imageUrl: { type: String },
});

// Correct Node.js export syntax
module.exports = mongoose.model("Card", CardSchema);
