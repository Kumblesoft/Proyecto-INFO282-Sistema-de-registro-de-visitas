import React, { createContext, useState, useEffect, useContext } from 'react'
import * as SecureStore from 'expo-secure-store'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

export const IdentifierContext = createContext()

export const IdentifierProvider = ({ children }) => {
  const [identifier, setIdentifier] = useState(null)
  const [originalIdentifier, setOriginalIdentifier] = useState(null)

  useEffect(() => {
    const checkOrCreateIdentifier = async () => {
      try {
        // Intenta cargar el identificador original
        let storedOriginalIdentifier = await SecureStore.getItemAsync('secure_deviceid')

        // Si no hay identificador original, genera uno nuevo y lo guarda
        if (!storedOriginalIdentifier) {
          const newIdentifier = uuidv4()
          console.log("Generated new original identifier:", newIdentifier)
          await SecureStore.setItemAsync('secure_deviceid', newIdentifier)
          storedOriginalIdentifier = newIdentifier
        }

        // Establece el identificador original
        setOriginalIdentifier(storedOriginalIdentifier)

        // Carga el último identificador, puede ser el mismo que el original al principio
        let storedIdentifier = await SecureStore.getItemAsync('last_deviceid')
        if (!storedIdentifier) {
          storedIdentifier = storedOriginalIdentifier
        }
        console.log("Identifier retrieved from SecureStore:", storedIdentifier)
        setIdentifier(storedIdentifier)
      } catch (error) {
        console.error("Error accessing SecureStore:", error)
      }
    }

    checkOrCreateIdentifier()
  }, [])

  const updateIdentifier = async (newIdentifier) => {
    await SecureStore.setItemAsync('last_deviceid', newIdentifier)
    setIdentifier(newIdentifier)
  }

  return (
    <IdentifierContext.Provider value={{ identifier, setIdentifier: updateIdentifier, originalIdentifier }}>
      {children}
    </IdentifierContext.Provider>
  )
}

export const useIdentifierContext = () => useContext(IdentifierContext)
