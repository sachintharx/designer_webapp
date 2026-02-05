import { NavLink } from "react-router-dom";
import { useState } from "react";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar modern-nav">
      <div className="nav-container">
        <NavLink to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <img src="/logo.png" alt="DesignHub Logo" className="brand-logo" />
          <div className="brand-info">
            <p className="brand-title">DesignHub</p>
            <p className="brand-sub">Where creativity meets opportunity</p>
          </div>
        </NavLink>
        
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={menuOpen ? "open" : ""}>☰</span>
        </button>

        <nav className={menuOpen ? "nav-open" : ""}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </NavLink>
          <NavLink to="/privacy" onClick={() => setMenuOpen(false)}>
            Privacy
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
