// IdentifierContext.js
import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const IdentifierContext = createContext();

// Función para generar un ID único
const generateUniqueId = () => {
  const timestamp = Date.now().toString(36); // Parte del tiempo actual en base 36
  const randomPart = Math.random().toString(36).substring(2, 10); // Parte aleatoria en base 36
  return `${timestamp}-${randomPart}`;
};

export const IdentifierProvider = ({ children }) => {
  const [identifier, setIdentifier] = useState(null);

  useEffect(() => {
    const checkOrCreateIdentifier = async () => {
      try {
        let storedIdentifier = await SecureStore.getItemAsync('deviceIdentifier');
        console.log("Identifier retrieved from SecureStore:", storedIdentifier);

        if (!storedIdentifier) {
          storedIdentifier = generateUniqueId();
          console.log("Generated new identifier:", storedIdentifier);
          await SecureStore.setItemAsync('deviceIdentifier', storedIdentifier);
        }

        setIdentifier(storedIdentifier);
      } catch (error) {
        console.error("Error accessing SecureStore:", error);
      }
    };

    checkOrCreateIdentifier();
  }, []);

  return (
    <IdentifierContext.Provider value={{ identifier }}>
      {children}
    </IdentifierContext.Provider>
  );
};
