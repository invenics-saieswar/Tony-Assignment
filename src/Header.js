import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegBell, FaTimes } from 'react-icons/fa'; // Import the close icon
import './Header.css';
import { useNotification } from './NotificationContext';
 
const Header = ({ handleAboutClick, handleContactClick }) => {
  const [showNotification, setShowNotification] = useState(false);
  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };
  const { notificationMessages } = useNotification();
 
  const refreshPage = () => {
    window.location.reload();
  };
 
  const handleDismiss = (Id) => {
    fetch(`http://localhost:3001/data/${Id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Notification ${Id} dismissed`);
          // Update your notification state or perform any other necessary actions
        } else {
          console.error('Failed to dismiss notification');
        }
      })
      .catch((error) => {
        console.error('Error while dismissing notification:', error);
      });
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
                {notificationMessages.map((message) => (
                  <li key={message.Id} className="notification-item">
                    <span>{message.Message}</span>
                    <FaTimes className="dismiss-icon" onClick={() => handleDismiss(message.Id)} />
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
        <Link className="nav-link" onClick={handleAboutClick}>About</Link>
        <Link className="nav-link" onClick={handleContactClick}>Contact</Link>
        <div className="nav-img"></div>
      </nav>
    </div>
  );
};
 
export default Header;