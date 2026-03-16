import { useState } from 'react';
import axios from 'axios';

export default function ManageDeck() {
  let [formData, setFormData] = useState({ name: '', type: '', manaValue: 0 });

  let handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/cards', formData)
      .then(() => alert('Card Added!'))
      .catch(err => console.log(err));
  };

  return (
    <div className="form-container">
      <h2>Add New Card</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Card Name" onChange={e => setFormData({...formData, name: e.target.value})} />
        <input type="text" placeholder="Type" onChange={e => setFormData({...formData, type: e.target.value})} />
        <input type="number" placeholder="Mana Value" onChange={e => setFormData({...formData, manaValue: e.target.value})} />
        <button type="submit">Add to Deck</button>
      </form>
    </div>
  );
}