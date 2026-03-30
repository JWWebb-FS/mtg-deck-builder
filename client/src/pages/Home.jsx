// client/src/pages/Home.jsx
import { useEffect, useState } from "react";
import axios from "axios";

// Live Render URL
let API_URL = "https://mtg-deck-builder-o20y.onrender.com";

export default function Home() {
  let [cards, setCards] = useState([]);

  // 1. GET is public, so no token needed here
  useEffect(() => {
    axios
      .get(`${API_URL}/api/cards`)
      .then((res) => setCards(res.data))
      .catch((err) => console.log(err));
  }, []);

  // NEW: Calculate total value from the card array
  const totalValue = cards.reduce((sum, card) => {
    const price = parseFloat(card.price) || 0;
    return sum + price;
  }, 0).toFixed(2);

  // 2. DELETE LOGIC (Protected)
  let deleteCard = (id) => {
    const token = localStorage.getItem("userToken");

    if (!token) return alert("Please login to remove cards!");

    axios
      .delete(`${API_URL}/api/cards/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        setCards(cards.filter((card) => card._id !== id));
      })
      .catch((err) => {
        console.log("Delete error:", err.response?.data || err.message);
        alert("Not authorized to delete.");
      });
  };

  // 3. UPDATE LOGIC (Protected)
  let updatePrice = (id, name) => {
    const token = localStorage.getItem("userToken");

    if (!token) return alert("Please login to update prices!");

    axios
      .get(`https://api.scryfall.com/cards/named?fuzzy=${name}`)
      .then((res) => {
        let newPrice = res.data.prices.usd || "N/A";
        axios
          .put(`${API_URL}/api/cards/${id}`, 
            { price: newPrice }, 
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then(() => {
            alert(`Updated ${name} price to $${newPrice}`);
            setCards(cards.map(card => card._id === id ? { ...card, price: newPrice } : card));
          });
      })
      .catch((err) => console.log("Price fetch failed", err));
  };

  return (
    <div className="deck-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>My MTG Deck List</h1>
        {/* NEW: Total Value Badge */}
        <div style={{ backgroundColor: "#28a745", color: "white", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold" }}>
          Vault Value: ${totalValue}
        </div>
      </div>

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
            <p><strong>Type:</strong> {card.type}</p>
            <p><strong>Mana Value:</strong> {card.manaValue}</p>
            <p><strong>Price:</strong> ${card.price || "0.00"}</p>

            <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
              <button
                onClick={() => updatePrice(card._id, card.name)}
                style={{ backgroundColor: "#3a86ff", color: "white", border: "none", padding: "8px 10px", borderRadius: "4px", cursor: "pointer" }}
              >
                Update Price
              </button>
              <button
                onClick={() => deleteCard(card._id)}
                style={{ backgroundColor: "#ff006e", color: "white", border: "none", padding: "8px 10px", borderRadius: "4px", cursor: "pointer" }}
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