import React, { createContext, useContext, useState } from 'react'

// Crear el contexto
const FormContext = createContext()

// Proveedor del contexto
export const FormProvider = ({ children }) => {
  const [selectedForm, setSelectedForm] = useState(null)

  return (
    <FormContext.Provider value={{ selectedForm, setSelectedForm }}>
      {children}
    </FormContext.Provider>
  )
}

// Hook para usar el contexto
export const useFormContext = () => {
  return useContext(FormContext)
}
