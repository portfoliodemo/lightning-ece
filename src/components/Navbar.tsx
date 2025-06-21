import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Logs, X } from 'lucide-react'; // optional icon library

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="nav-header max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          <Link to="/">Lightning ECE</Link>
        </h1>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold underline"
                  : "text-gray-700 hover:text-blue-600 transition"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold underline"
                  : "text-gray-700 hover:text-blue-600 transition"
              }
            >
              Login
            </NavLink>
          </li>
        </ul>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Logs className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 pt-2 border-t border-gray-100">
          <ul className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            <li>
              <Link
                to="/"
                className="block hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="block hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}