import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notificationMessages, setNotificationMessages] = useState([]);

  const addNotification = (message) => {
    setNotificationMessages([...notificationMessages, message]);
  };

  return (
    <NotificationContext.Provider value={{ notificationMessages, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};