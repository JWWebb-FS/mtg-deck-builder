// server/index.js
let express = require("express");
let mongoose = require("mongoose");
let cors = require("cors");
require("dotenv").config();

// Import the Models (Requirement #5)
let Card = require("./models/Card");
let Deck = require("./models/Deck");

let app = express();
let PORT = process.env.PORT || 5000;

// Middleware (Requirement #1)
app.use(
  cors({
    origin: [
      "https://mtg-deck-builder-psi.vercel.app",
      "http://localhost:5173",
      "http://localhost:8081",
      "https://mobile-mtg-deck-builder.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

// MongoDB Connection (DaaS - Requirement #3)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MTG Database Connected"))
  .catch((err) => console.log("Conn Error Check .env:", err));

// --- API ROUTES (Requirement #3 & #4) ---

// --- CARD ROUTES ---
app.get("/api/cards", async (req, res) => {
  try {
    let cards = await Card.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cards" });
  }
});

app.post("/api/cards", async (req, res) => {
  try {
    let newCard = new Card(req.body);
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(400).json({ message: "Error saving card" });
  }
});

app.put("/api/cards/:id", async (req, res) => {
  try {
    let updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedCard);
  } catch (err) {
    res.status(400).json({ message: "Error updating card" });
  }
});

app.delete("/api/cards/:id", async (req, res) => {
  try {
    let deletedCard = await Card.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedCard);
  } catch (err) {
    res.status(500).json({ message: "Error deleting card" });
  }
});

// --- DECK ROUTES (New Module) ---
// 1. GET: Fetch all decks from the vault
app.get("/api/decks", async (req, res) => {
  try {
    let decks = await Deck.find();
    res.json(decks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching decks" });
  }
});

// 2. POST: Create a new deck in the vault
app.post("/api/decks", async (req, res) => {
  try {
    let newDeck = new Deck(req.body);
    await newDeck.save();
    res.status(201).json(newDeck);
  } catch (err) {
    res.status(400).json({ message: "Error saving deck" });
  }
});

// 3. PUT: Update deck details
app.put("/api/decks/:id", async (req, res) => {
  try {
    let updatedDeck = await Deck.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedDeck);
  } catch (err) {
    res.status(400).json({ message: "Error updating deck" });
  }
});

// 4. DELETE: Remove a deck by ID
app.delete("/api/decks/:id", async (req, res) => {
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
