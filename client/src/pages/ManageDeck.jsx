import { useState } from "react";
import axios from "axios";

export default function ManageDeck() {
  let [formData, setFormData] = useState({ name: "", type: "", manaValue: 0 });

  let handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/cards", formData)
      .then(() => alert("Card Added!"))
      .catch((err) => console.log(err));
  };
  // client/src/pages/ManageDeck.jsx

  let fetchScryfallData = () => {
    if (!formData.name) return alert("Enter a card name first!");

    axios
      .get(`https://api.scryfall.com/cards/named?fuzzy=${formData.name}`)
      .then((res) => {
        // We pull the image and price directly from the Scryfall response
        let scryfallPrice = res.data.prices.usd || "0.00";
        let scryfallImage = res.data.image_uris?.normal || "";

        setFormData({
          ...formData,
          name: res.data.name,
          type: res.data.type_line,
          manaValue: res.data.cmc,
          price: scryfallPrice, // New field
          imageUrl: scryfallImage, // New field
        });
        alert(`Found ${res.data.name}! Data and image auto-filled.`);
      })
      .catch((err) => {
        console.log(err);
        alert("Card not found on Scryfall.");
      });
  };
  return (
    <div className="form-container">
      <h2>Add New Card</h2>
      <form onSubmit={handleSubmit}>
        {/* Updated Name Input */}
        <input
          type="text"
          placeholder="Card Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        {/* New Search Button */}
        <button
          type="button"
          onClick={fetchScryfallData}
          style={{ backgroundColor: "#3a86ff", marginBottom: "10px" }}
        >
          Search Scryfall
        </button>

        {/* Updated Type & Mana Value Inputs */}
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
