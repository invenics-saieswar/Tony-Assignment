import React from 'react';
import { Link} from 'react-router-dom';
import './Header.css';

const Header = ({ onNavItemClick }) => {
    
  const refreshPage = () => {
    window.location.reload();
  };
  return (
    <div className='Main-div'>
    <nav className="navbar">
    <div className="nav-text"><strong>Project Management System</strong></div>
      <Link to="/" className="nav-link" onClick={refreshPage}>Home</Link>
      <Link to="/about" className="nav-link" onClick={() => onNavItemClick('About')}>About</Link>
      <Link to="/contact" className="nav-link" onClick={() => onNavItemClick('About')}>Contact</Link>
    <div className="nav-img">
        
    </div>
    </nav>
    </div>
  );
};

export default Header;
