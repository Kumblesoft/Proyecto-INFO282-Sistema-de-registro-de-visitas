import React, { useState, useEffect } from 'react'
import { Radio, RadioGroup, Text } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'

const RadioButtonGroup = ({ items, onSelect, defaultOption }) => {
  const [selectedIndex, setSelectedIndex] = useState(null)

  // Al cargar, selecciona el valor predeterminado si se pasa
  useEffect(() => {
    const index = items.findIndex(item => item.value === defaultOption) 
    setSelectedIndex(index !== -1 ? index : null)
  }, [defaultOption])

  const handleSelect = index => {
    setSelectedIndex(index) // Actualiza el índice seleccionado
    if (onSelect) onSelect(items[index].valor) // Llama al callback con el valor seleccionado
  }

  return (
    <RadioGroup selectedIndex={selectedIndex} onChange={handleSelect}>
      {items.map(item => (
        <Radio key={item.valor} style={styles.radio}>
          <Text>{item.nombre}</Text>
        </Radio>
      ))}
    </RadioGroup>
  )
}

const styles = StyleSheet.create({
  radio: {
    marginVertical: 5
  }
})

export default RadioButtonGroup
