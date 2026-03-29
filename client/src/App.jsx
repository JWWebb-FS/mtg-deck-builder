import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import ManageDeck from './pages/ManageDeck';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userToken"));

  // This "listens" for changes to the token status
  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("userToken"));
    };
    
    // Check whenever the component mounts or storage changes
    window.addEventListener('storage', handleAuthChange);
    return () => window.removeEventListener('storage', handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false); // Instantly update the UI
    window.location.href = "/login"; 
  };

  return (
    <Router>
      <nav style={{ padding: '10px', background: '#222', marginBottom: '20px', display: 'flex', gap: '15px' }}>
        <Link style={{ color: '#fff', textDecoration: 'none' }} to="/">Home</Link>
        <Link style={{ color: '#fff', textDecoration: 'none' }} to="/manage">Manage Deck</Link>
        
        {!isLoggedIn ? (
          <>
            <Link style={{ color: '#fff', textDecoration: 'none' }} to="/login">Login</Link>
            <Link style={{ color: '#fff', textDecoration: 'none' }} to="/register">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
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