import React, { useState } from 'react'
import { Radio, RadioGroup, Text } from '@ui-kitten/components'
import { View, StyleSheet } from 'react-native'

const RadioButtonGroup = ({ items, onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(null)

  const handleSelect = index => {
    setSelectedIndex(index) // Actualiza el índice seleccionado
    if (onSelect) onSelect(items[index].value) // Llama al callback con el valor seleccionado
  }

  return (
    <RadioGroup selectedIndex={selectedIndex} onChange={handleSelect}>
      {items.map(item => (
        <Radio key={item.value} style={styles.radio}>
          <Text>{item.name}</Text>
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
