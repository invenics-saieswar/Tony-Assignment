import React, { createContext, useContext, useState, useEffect } from 'react';
 
const NotificationContext = createContext();
 
export const useNotification = () => useContext(NotificationContext);
 
export const NotificationProvider = ({ children }) => {
  const [notificationMessages, setNotificationMessages] = useState([]);
 
  useEffect(() => {
    fetch('http://localhost:3001/data') // Replace with your server endpoint
      .then((response) => response.json())
      .then((data) => {
        setNotificationMessages(data); // Set the fetched data to the state
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, ); // Empty dependency array to run once on mount
 
  const addNotification = (message) => {
    setNotificationMessages([...notificationMessages, message]);
    // Add further logic if required
    console.log(notificationMessages)
  };
 
  return (
    <NotificationContext.Provider value={{ notificationMessages, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};