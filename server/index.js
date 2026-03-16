// server/index.js
let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
require('dotenv').config();

// Import the Model (Requirement #5)
let Card = require('./models/Card'); 

let app = express();
let PORT = process.env.PORT || 5000;

// Middleware (Requirement #1)
app.use(cors());
app.use(express.json());

// MongoDB Connection (DaaS - Requirement #3)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MTG Database Connected"))
    .catch(err => console.log("Conn Error Check .env:", err));

// --- API ROUTES (Requirement #3 & #4) ---

// 1. GET: Fetch all cards from the deck
app.get('/api/cards', async (req, res) => {
    try {
        let cards = await Card.find();
        res.json(cards);
    } catch (err) {
        res.status(500).json({ message: "Error fetching cards" });
    }
});

// 2. POST: Add a new card to the deck
app.post('/api/cards', async (req, res) => {
    try {
        let newCard = new Card(req.body);
        await newCard.save();
        res.status(201).json(newCard);
    } catch (err) {
        res.status(400).json({ message: "Error saving card" });
    }
});

// 3. PUT: Update card details (e.g., updating prices from Scryfall)
app.put('/api/cards/:id', async (req, res) => {
    try {
        let updatedCard = await Card.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedCard);
    } catch (err) {
        res.status(400).json({ message: "Error updating card" });
    }
});

// 4. DELETE: Remove a card by ID
app.delete('/api/cards/:id', async (req, res) => {
    try {
        let deletedCard = await Card.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedCard);
    } catch (err) {
        res.status(500).json({ message: "Error deleting card" });
    }
});

// Basic Route for Testing
app.get('/', (req, res) => {
    res.send("MTG Deck Builder API is Running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});