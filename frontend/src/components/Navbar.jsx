import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <img src="/mlsa-icon.svg" alt="MLSA" className="navbar-logo" />
          <span>MLSA</span>
        </Link>
        <nav className="navbar-links">
          {/* <a href="#events">Events</a>
          <a href="#team">Team</a> */}
          <Link to="/admin" className="navbar-admin-link">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
