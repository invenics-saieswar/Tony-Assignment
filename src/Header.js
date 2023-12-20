import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegBell } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const addNotification = (message, type) => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
    };

    setNotifications([...notifications, newNotification]);

    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  };

  const removeNotification = (id) => {
    const updatedNotifications = notifications.filter((notification) => notification.id !== id);
    setNotifications(updatedNotifications);
  };

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
            {/* Your notification content goes here */}
            Notification Message
          </div>
        )}
        <Link to="/" className="nav-link" onClick={refreshPage}>Home</Link>
        <Link to="/about" className="nav-link" >About</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
        <div className="nav-img"></div>
      </nav>
    </div>
  );
};

export default Header;
