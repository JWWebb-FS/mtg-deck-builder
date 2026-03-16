// client/src/pages/Home.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  let [cards, setCards] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/cards')
      .then(res => setCards(res.data))
      .catch(err => console.log(err));
  }, []);

  // DELETE LOGIC
  let deleteCard = (id) => {
    axios.delete(`http://localhost:5000/api/cards/${id}`)
      .then(() => {
        // This line removes the card from your screen instantly
        setCards(cards.filter(card => card._id !== id));
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="deck-container">
      <h1>My MTG Deck List</h1>
      <div className="card-grid">
        {cards.map(card => (
          <div key={card._id} className="mtg-card">
            <h3>{card.name}</h3>
            <p>Type: {card.type}</p>
            <p>Mana Value: {card.manaValue}</p>
            <button 
              onClick={() => deleteCard(card._id)} 
              style={{backgroundColor: '#ff006e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}
            >
              Remove Card
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}