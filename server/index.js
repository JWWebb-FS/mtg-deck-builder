// server/index.js
let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
require('dotenv').config();

let app = express();
let PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MTG Database Connected"))
    .catch(err => console.log(err));

// Basic Route for Testing
app.get('/', (req, res) => {
    res.send("MTG Deck Builder API is Running");
});

// DELETE: Remove a card by ID
app.delete('/api/cards/:id', async (req, res) => {
    try {
        let deletedCard = await Card.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedCard);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});