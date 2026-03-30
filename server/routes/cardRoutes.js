const express = require('express');
const router = express.Router();
const Card = require('../models/Card'); // Ensure this path matches your Card model
const { protect } = require('../middleware/authMiddleware'); // Ensure this matches your protect middleware

// 1. GET all cards (Public - for your web home page)
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (_error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. GET a single card by ID (Protected - for mobile details)
router.get('/:id', protect, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.json(card);
  } catch (_error) {
    res.status(500).json({ message: "Error fetching card details" });
  }
});

// 3. POST a new card (Protected)
router.post('/', protect, async (req, res) => {
  try {
    const { name, type, manaValue, price, imageUrl } = req.body;
    const newCard = new Card({ name, type, manaValue, price, imageUrl });
    await newCard.save();
    res.status(201).json(newCard);
  } catch (_error) {
    res.status(400).json({ message: "Error saving card" });
  }
});

// 4. PUT update a card (Protected - for price updates)
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCard);
  } catch (_error) {
    res.status(400).json({ message: "Error updating card" });
  }
});

// 5. DELETE a card (Protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json({ message: "Card deleted" });
  } catch (_error) {
    res.status(400).json({ message: "Error deleting card" });
  }
});

module.exports = router;