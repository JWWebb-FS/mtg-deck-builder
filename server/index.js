// server/index.js
let express = require("express");
let mongoose = require("mongoose");
let cors = require("cors");
require("dotenv").config();

// Import the Models
let Card = require("./models/Card");
let Deck = require("./models/Deck");

// Import Auth Routes and Middleware (New for Phase 1)
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/auth"); 

let app = express();
let PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MTG Database Connected"))
  .catch((err) => console.log("Conn Error Check .env:", err));

// --- API ROUTES ---

// 1. AUTH ROUTES (New)
app.use("/api/auth", authRoutes);

// --- CARD ROUTES ---
// Public: Anyone can view cards
app.get("/api/cards", async (req, res) => {
  try {
    let cards = await Card.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cards" });
  }
});

// Protected: Must be logged in to create, update, or delete cards
app.post("/api/cards", protect, async (req, res) => {
  try {
    let newCard = new Card(req.body);
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(400).json({ message: "Error saving card" });
  }
});

app.put("/api/cards/:id", protect, async (req, res) => {
  try {
    let updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedCard);
  } catch (err) {
    res.status(400).json({ message: "Error updating card" });
  }
});

app.delete("/api/cards/:id", protect, async (req, res) => {
  try {
    let deletedCard = await Card.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedCard);
  } catch (err) {
    res.status(500).json({ message: "Error deleting card" });
  }
});

// --- DECK ROUTES ---
// Public: Anyone can view decks
app.get("/api/decks", async (req, res) => {
  try {
    let decks = await Deck.find();
    res.json(decks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching decks" });
  }
});

// Protected: Must be logged in to create, update, or delete decks
app.post("/api/decks", protect, async (req, res) => {
  try {
    let newDeck = new Deck(req.body);
    await newDeck.save();
    res.status(201).json(newDeck);
  } catch (err) {
    res.status(400).json({ message: "Error saving deck" });
  }
});

app.put("/api/decks/:id", protect, async (req, res) => {
  try {
    let updatedDeck = await Deck.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedDeck);
  } catch (err) {
    res.status(400).json({ message: "Error updating deck" });
  }
});

app.delete("/api/decks/:id", protect, async (req, res) => {
  try {
    let deletedDeck = await Deck.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedDeck);
  } catch (err) {
    res.status(500).json({ message: "Error deleting deck" });
  }
});

// Basic Route for Testing
app.get("/", (req, res) => {
  res.send("MTG Deck Builder API is Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});