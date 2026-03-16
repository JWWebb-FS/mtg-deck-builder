import{useState} from 'react';
import axios from 'axios';

export default function ManageDeck() {
  let [formData, setFormData] = useState({ name: '', type: '', manaValue: 0 });

  let handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/cards', formData)
      .then(() => alert('Card Added!'))
      .catch(err => console.log(err));
  };

  
  let fetchScryfallData = () => {
    if (!formData.name) return alert("Enter a card name first!");

    axios.get(`https://api.scryfall.com/cards/named?fuzzy=${formData.name}`)
      .then(res => {
        setFormData({
          ...formData,
          name: res.data.name,
          type: res.data.type_line,
          manaValue: res.data.cmc
        });
        alert(`Found ${res.data.name}! Data auto-filled.`);
      })
      .catch(err => {
  console.log("Scryfall Error:", err); 
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
          onChange={e => setFormData({...formData, name: e.target.value})} 
        />
        
        {/* New Search Button */}
        <button type="button" onClick={fetchScryfallData} style={{backgroundColor: '#3a86ff', marginBottom: '10px'}}>
          Search Scryfall
        </button>

        {/* Updated Type & Mana Value Inputs */}
        <input 
          type="text" 
          placeholder="Type" 
          value={formData.type} 
          onChange={e => setFormData({...formData, type: e.target.value})} 
        />
        <input 
          type="number" 
          placeholder="Mana Value" 
          value={formData.manaValue} 
          onChange={e => setFormData({...formData, manaValue: e.target.value})} 
        />

        <button type="submit">Add to Deck</button>
      </form>
    </div>
  );
}