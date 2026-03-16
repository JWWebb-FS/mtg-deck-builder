import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ManageDeck from './pages/ManageDeck';

function App() {
  return (
    <Router>
      <nav>
        <Link style={{marginRight: '10px'}} to="/">Home</Link>
        <Link to="/manage">Manage Deck</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manage" element={<ManageDeck />} />
      </Routes>
    </Router>
  );
}

export default App;