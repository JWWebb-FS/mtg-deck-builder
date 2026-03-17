// client/src/pages/ManageDeck.jsx
import { useState } from "react";
import axios from "axios";

// Live Render URL
let API_URL = "https://mtg-deck-builder-o20y.onrender.com";

export default function ManageDeck() {
  let [formData, setFormData] = useState({
    name: "",
    type: "",
    manaValue: 0,
    price: "0.00",
    imageUrl: "",
  });

  let [searchResults, setSearchResults] = useState([]);

  // Fix: Convert manaValue to a Number to prevent 400 Bad Request errors
  let handleSubmit = (e) => {
    e.preventDefault();

    // Verification check for school requirements
    if (!formData.name || !formData.type) {
      return alert("Please search for and select a card first!");
    }

    // Data cleaning
    let dataToSubmit = {
      ...formData,
      manaValue: Number(formData.manaValue),
    };

    axios
      .post(`${API_URL}/api/cards`, dataToSubmit)
      .then(() => {
        alert("Card Added!");
        setFormData({
          name: "",
          type: "",
          manaValue: 0,
          price: "0.00",
          imageUrl: "",
        });
      })
      .catch((err) => {
        console.log("Submit error:", err);
        alert("Server rejected the card data (Check Console).");
      });
  };

  let fetchScryfallData = () => {
    if (!formData.name) return alert("Enter part of a name first!");
    axios
      .get(
        `https://api.scryfall.com/cards/search?q=${formData.name}&order=edhrec`
      )
      .then((res) => {
        setSearchResults(res.data.data.slice(0, 10));
      })
      .catch((err) => {
        console.log(err);
        alert("No cards found with that partial name.");
      });
  };

  let fetchAllPrintings = (oracleId) => {
    axios
      .get(
        `https://api.scryfall.com/cards/search?q=oracle_id:${oracleId}&unique=prints`
      )
      .then((res) => {
        setSearchResults(res.data.data);
      })
      .catch((err) => console.log("Could not find other sets", err));
  };

  let selectCard = (card) => {
    let selectedImage =
      card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || "";
    setFormData({
      ...formData,
      name: card.name,
      type: card.type_line,
      manaValue: card.cmc,
      price: card.prices.usd || "0.00",
      imageUrl: selectedImage,
    });
    setSearchResults([]);
  };

  return (
    <div className="form-container">
      <h2>Add New Card</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Card Name (Partial OK)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <button
          type="button"
          onClick={fetchScryfallData}
          style={{
            backgroundColor: "#3a86ff",
            marginBottom: "10px",
            cursor: "pointer",
          }}
        >
          Search Scryfall
        </button>

        {searchResults.length > 0 && (
          <div
            className="search-results"
            style={{
              background: "#2a2a2a",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
              maxHeight: "350px",
              overflowY: "auto",
            }}
          >
            {searchResults.map((card) => (
              <div
                key={card.id}
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #444",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <div
                  onClick={() => selectCard(card)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <img
                    src={
                      card.image_uris?.small ||
                      card.card_faces?.[0]?.image_uris?.small ||
                      ""
                    }
                    alt={card.name}
                    style={{ width: "40px", borderRadius: "3px" }}
                  />
                  <div style={{ fontSize: "0.9rem" }}>
                    <div style={{ fontWeight: "bold" }}>{card.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#888" }}>
                      {card.set_name}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fetchAllPrintings(card.oracle_id)}
                  style={{
                    fontSize: "0.65rem",
                    width: "fit-content",
                    background: "#444",
                    color: "#fff",
                    border: "none",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  Change Set / All Printings
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="text"
          placeholder="Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        />
        <input
          type="number"
          placeholder="Mana Value"
          value={formData.manaValue}
          onChange={(e) =>
            setFormData({ ...formData, manaValue: Number(e.target.value) })
          }
        />
        <button type="submit" style={{ cursor: "pointer" }}>
          Add to Deck
        </button>
      </form>
    </div>
  );
}
