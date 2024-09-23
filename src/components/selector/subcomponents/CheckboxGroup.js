import React, { useEffect, useState } from 'react'
import { CheckBox, Text } from '@ui-kitten/components'
import { View, StyleSheet } from 'react-native'

const CheckboxGroup = ({ items, onSelect, value }) => {
  const [selectedValues, setSelectedValues] = useState([])

  const handleSelect = itemValue => {
    const newSelectedValues = selectedValues.includes(itemValue)
      ? selectedValues.filter(val => val !== itemValue) // Desmarcar
      : [...selectedValues, itemValue] // Marcar

    setSelectedValues(newSelectedValues)

    if (onSelect) onSelect(newSelectedValues) // Llama al callback con los valores seleccionados
  }

  useEffect(() => {
    setSelectedValues(Array.isArray(value) ? value : [value]) // Asigna el valor por defecto
  }, [value])

  return (
    <View style={styles.container}>
      {items.map(item => (
        <View key={item.value} style={styles.checkboxContainer}>
          <CheckBox
            checked={selectedValues.includes(item.value)}
            onChange={() => handleSelect(item.value)}
            style={styles.checkbox} // Estilo personalizado
          >
            <Text style={styles.checkboxText}>{item.name}</Text> {/* Texto más grande */}
          </CheckBox>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  },
  checkboxContainer: {
    marginVertical: 5 // Espacio entre los checkboxes
  },
  checkboxText: {
    fontSize: 18, // Tamaño de fuente más grande
  }
})

export default CheckboxGroup
