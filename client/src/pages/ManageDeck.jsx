import { useState } from "react";
import axios from "axios";

export default function ManageDeck() {
  let [formData, setFormData] = useState({
    name: "",
    type: "",
    manaValue: 0,
    price: "0.00",
    imageUrl: "",
  });

  let [searchResults, setSearchResults] = useState([]);

  let handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/cards", formData)
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
      .catch((err) => console.log(err));
  };

  let fetchScryfallData = () => {
    if (!formData.name) return alert("Enter part of a name first!");

    // Added '&order=edhrec' to sort by popularity so big cards show up in the top results
    axios
      .get(
        `https://api.scryfall.com/cards/search?q=${formData.name}&order=edhrec`
      )
      .then((res) => {
        // Increased slice to 10 to give you more options on your break
        setSearchResults(res.data.data.slice(0, 10));
      })
      .catch((err) => {
        console.log(err);
        alert("No cards found with that partial name.");
      });
  };

  let selectCard = (card) => {
    // Safety check: handle double-faced cards by checking 'card_faces' if 'image_uris' is missing
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
              maxHeight: "300px",
              overflowY: "auto", // Added scroll so it doesn't eat your whole screen
            }}
          >
            <p style={{ fontSize: "0.8rem", color: "#aaa" }}>
              Select the correct version:
            </p>
            {searchResults.map((card) => (
              <div
                key={card.id}
                onClick={() => selectCard(card)}
                style={{
                  cursor: "pointer",
                  padding: "8px",
                  borderBottom: "1px solid #444",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img
                  // Check card_faces for thumbnail too
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
            setFormData({ ...formData, manaValue: e.target.value })
          }
        />

        <button type="submit" style={{ cursor: "pointer" }}>
          Add to Deck
        </button>
      </form>
    </div>
  );
}
