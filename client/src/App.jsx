import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ManageDeck from './pages/ManageDeck';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  // Check if the user is logged in to show/hide the Logout button
  const token = localStorage.getItem("userToken");

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/login"; // Force a reload to clear the state
  };

  return (
    <Router>
      <nav style={{ padding: '10px', background: '#222', marginBottom: '20px' }}>
        <Link style={{ marginRight: '15px', color: '#fff', textDecoration: 'none' }} to="/">Home</Link>
        <Link style={{ marginRight: '15px', color: '#fff', textDecoration: 'none' }} to="/manage">Manage Deck</Link>
        
        {!token ? (
          <>
            <Link style={{ marginRight: '15px', color: '#fff', textDecoration: 'none' }} to="/login">Login</Link>
            <Link style={{ color: '#fff', textDecoration: 'none' }} to="/register">Register</Link>
          </>
        ) : (
          <button 
            onClick={handleLogout} 
            style={{ 
              background: '#ff4d4d', 
              color: 'white', 
              border: 'none', 
              padding: '5px 10px', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Logout
          </button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manage" element={<ManageDeck />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;