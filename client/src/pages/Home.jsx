// client/src/pages/Home.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  let [cards, setCards] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/cards")
      .then((res) => setCards(res.data))
      .catch((err) => console.log(err));
  }, []);

  // DELETE LOGIC
  let deleteCard = (id) => {
    axios
      .delete(`http://localhost:5000/api/cards/${id}`)
      .then(() => {
        // This line removes the card from your screen instantly
        setCards(cards.filter((card) => card._id !== id));
      })
      .catch((err) => console.log(err));
  };
  let updatePrice = (id, name) => {
    axios
      .get(`https://api.scryfall.com/cards/named?fuzzy=${name}`)
      .then((res) => {
        let newPrice = res.data.prices.usd || "N/A";
        // Call YOUR API to update the database
        axios
          .put(`http://localhost:5000/api/cards/${id}`, { price: newPrice })
          .then(() => {
            alert(`Updated ${name} price to $${newPrice}`);
            // Refresh the list
            window.location.reload();
          });
      })
      .catch((err) => console.log("Price fetch failed", err));
  };
  return (
    <div className="deck-container">
      <h1>My MTG Deck List</h1>
      <div className="card-grid">
        {cards.map((card) => (
          <div key={card._id} className="mtg-card">
            {/* 1. Added Card Image */}
            {card.imageUrl && (
              <img
                src={card.imageUrl}
                alt={card.name}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              />
            )}

            <h3>{card.name}</h3>
            <p>
              <strong>Type:</strong> {card.type}
            </p>
            <p>
              <strong>Mana Value:</strong> {card.manaValue}
            </p>

            {/* 2. Added Price Display */}
            <p>
              <strong>Price:</strong> ${card.price || "0.00"}
            </p>

            <div
              style={{ display: "flex", gap: "10px", flexDirection: "column" }}
            >
              {/* 3. Added Update Price Button */}
              <button
                onClick={() => updatePrice(card._id, card.name)}
                style={{
                  backgroundColor: "#3a86ff",
                  color: "white",
                  border: "none",
                  padding: "8px 10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Update Price
              </button>

              {/* 4. Added Delete Button */}
              <button
                onClick={() => deleteCard(card._id)}
                style={{
                  backgroundColor: "#ff006e",
                  color: "white",
                  border: "none",
                  padding: "8px 10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Remove Card
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
