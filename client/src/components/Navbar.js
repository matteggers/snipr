import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import '../styles/components/Navbar.css';

function NavMenu() {
  return (
    <nav className="navbar">
      <div className="left">
        <Link to="/">
          Snipr
        </Link>
      </div>
      <div className="navbar-center">
        <ul>
          <li>
            <Link to="/">
              Home
            </Link>
          </li>
          <li>
            <Link to="/liked">
              Liked
            </Link>
          </li>
          <li>
            <Link to="/disliked">
              Disliked
            </Link>
          </li>
          <li>
            <Link to="/read_later">
              Read later
            </Link>
          </li>
        </ul>
      </div>
      <div className="right">
        <ul>
          <li>Search box</li>
          <li>Search button</li>
        </ul>
      </div>
    </nav>
  );
}

export default NavMenu;