import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

const EntradaTexto = ({ items, onSelect }) => {
  const [textData, setTextData] = useState(items || {})
  const [fields, setFields] = useState(Object.keys(items || {}))


  const handleChange = (name, value) => {
    const updatedTextData = {
      ...textData,
      [name]: value,
    }
    setTextData(updatedTextData)
    // Llama a la función `onSelect` 
    onSelect(name, value)
  }

  return (
    <View style={styles.container}>
      {/* Generar los campos dinámicamente */}
      {fields.map((field) => (
        <View key={field} style={styles.field}>
          <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
          <TextInput
            style={styles.input}
            value={textData[field] || ''}
            placeholder={`Ingrese su ${field}`}
            onChangeText={(value) => handleChange(field, value)}
            placeholderTextColor="#888"
          />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Asegura que el contenedor ocupe toda la pantalla
    padding: 10,
    backgroundColor: '#ffffff',
  },
  field: {
    marginBottom: 20,
    minWidth: 300,
  },
  label: {
    fontSize: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 15,
  },
})

export default EntradaTexto
