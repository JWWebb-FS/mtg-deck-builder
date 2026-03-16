// server/models/Card.js
let mongoose = require('mongoose');

let CardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    manaValue: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Card', CardSchema);