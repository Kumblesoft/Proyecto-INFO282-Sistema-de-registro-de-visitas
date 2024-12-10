import React, { createContext, useState, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as FileSystem from 'expo-file-system'

export const TemplateContext = createContext()

export const TemplateProvider = ({ children }) => {
  const [templates, setTemplates] = useState(null)

  const checkOrCreateTemplates = async () => {
    try {
      // Intenta cargar el identificador original
      let Templates = await AsyncStorage.getItem(`${FileSystem.documentDirectory}forms.json`)

      // Si no hay identificador original, genera uno nuevo y lo guarda
      if (!Templates) {
        const newTemplates = `${FileSystem.documentDirectory}forms.json`
        console.log("Generated new forms template:", newTemplates)
        await AsyncStorage.setItem('templates', newTemplates)
        setTemplates(newTemplates)
      }

      console.log("Saved Templates:", Templates)
    } catch (error) {
      console.error("Error accessing AsyncStorage:", error)
    }
  }

  checkOrCreateTemplates()

  const updateTemplates = async (newTemplate) => {
    await AsyncStorage.setItem('templates', newTemplate)
    setTemplates(newTemplate)
  }

  return (
    <TemplateContext.Provider value={{ templates, setTemplates: updateTemplates }}>
      {children}
    </TemplateContext.Provider>
  )
}

export const useTemplateContext = () => useContext(TemplateContext)
