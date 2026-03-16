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

  // State to hold the list of cards found by the search
  let [searchResults, setSearchResults] = useState([]);

  let handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/cards", formData)
      .then(() => {
        alert("Card Added!");
        // Clear the form after adding
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

    // Using the search endpoint to find multiple matches
    axios
      .get(`https://api.scryfall.com/cards/search?q=${formData.name}`)
      .then((res) => {
        // Limit to top 5 results to keep the UI clean
        setSearchResults(res.data.data.slice(0, 5));
      })
      .catch((err) => {
        console.log(err);
        alert("No cards found with that partial name.");
      });
  };

  let selectCard = (card) => {
    setFormData({
      ...formData,
      name: card.name,
      type: card.type_line,
      manaValue: card.cmc,
      price: card.prices.usd || "0.00",
      imageUrl: card.image_uris?.normal || "",
    });
    setSearchResults([]); // Clear the list once a card is selected
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
          style={{ backgroundColor: "#3a86ff", marginBottom: "10px" }}
        >
          Search Scryfall
        </button>

        {/* Display Search Results for Selection */}
        {searchResults.length > 0 && (
          <div
            className="search-results"
            style={{
              background: "#2a2a2a",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
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
                  fontSize: "0.9rem",
                }}
              >
                {card.name} — {card.set_name}
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

        <button type="submit">Add to Deck</button>
      </form>
    </div>
  );
}
