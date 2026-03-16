// client/src/pages/Home.jsx
import { useEffect, useState } from "react";
import axios from "axios";

// Live Render URL
let API_URL = "https://mtg-deck-builder-o20y.onrender.com";

export default function Home() {
  let [cards, setCards] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/cards`)
      .then((res) => setCards(res.data))
      .catch((err) => console.log(err));
  }, []);

  // DELETE LOGIC
  let deleteCard = (id) => {
    axios
      .delete(`${API_URL}/api/cards/${id}`)
      .then(() => {
        setCards(cards.filter((card) => card._id !== id));
      })
      .catch((err) => console.log(err));
  };

  let updatePrice = (id, name) => {
    axios
      .get(`https://api.scryfall.com/cards/named?fuzzy=${name}`)
      .then((res) => {
        let newPrice = res.data.prices.usd || "N/A";
        axios
          .put(`${API_URL}/api/cards/${id}`, { price: newPrice })
          .then(() => {
            alert(`Updated ${name} price to $${newPrice}`);
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
            <p>
              <strong>Price:</strong> ${card.price || "0.00"}
            </p>

            <div
              style={{ display: "flex", gap: "10px", flexDirection: "column" }}
            >
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
