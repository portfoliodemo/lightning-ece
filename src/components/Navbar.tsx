// import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
// import { Zap } from 'lucide-react'; // Uncomment if you want to use the Zap icon
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/lightning-ece-logo.jpg'
// import { Logs, X } from 'lucide-react'; // optional icon library

export default function Navbar() {
  // const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login'); // Redirect to login after logout
  }

  return (
    // <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50"></nav>
    <nav>
      <div className="nav-header max-w-7-xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="logo-header">
          <figure className="logo">
            <img
              src={logo}
              alt="Lightning ECE Logo"
              className="daycare-logo"
              />
          </figure>
          <Link to="/">Lightning ECE</Link>
        </div>

        <div className="nav-links">
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
            {user ? (
              <>
                <li>
                <span>Welcome, {user.fullName}</span>
                <button onClick={handleLogout}>
                  Logout
                </button>
                </li>
              </>
              ) : (  
                <NavLink to="/login">Login</NavLink>
              )}
        </ul>
        </div>
      </div>
    </nav>
  );
}