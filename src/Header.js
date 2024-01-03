import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegBell } from 'react-icons/fa';
import './Header.css';
import { useNotification } from './NotificationContext';


const Header = ({ handleAboutClick ,handleContactClick}) => {
  const [showNotification, setShowNotification] = useState(false);
  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };
  const { notificationMessages } = useNotification();

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className='Main-div'>
      <nav className="navbar">
        <div className="nav-text"><strong>Project Management System</strong></div>
        <FaRegBell className="bell-icon" onClick={toggleNotification} />
        {showNotification && (
          <div className="notification-popup">
            {notificationMessages && notificationMessages.length > 0 ? (
              <ul className="notification-list">
                {notificationMessages.map((message, index) => (
                  <li key={index} className="notification-item">
                    {message}
                  </li>
                ))}
              </ul>
            ) : (
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    No notifications
  </div>
            )}
          </div>
        )}
        <Link to="/" className="nav-link" onClick={refreshPage}>Home</Link>
        {/* <Link to="/about" className="nav-link" >About</Link> */}
        <Link className="nav-link" onClick={handleAboutClick}>About</Link>
        <Link className="nav-link" onClick={handleContactClick} >Contact</Link>
        <div className="nav-img"></div>
      </nav>
    </div>
  );
};

export default Header;
