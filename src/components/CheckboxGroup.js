import React, { useState } from 'react'
import { CheckBox, Text } from '@ui-kitten/components'
import { View, StyleSheet } from 'react-native'

const CheckboxGroup = ({ items, onSelect }) => {
  const [selectedValues, setSelectedValues] = useState([])

  const handleSelect = itemValue => {
    const newSelectedValues = selectedValues.includes(itemValue)
      ? selectedValues.filter(value => value !== itemValue) // Desmarcar
      : [...selectedValues, itemValue] // Marcar

    setSelectedValues(newSelectedValues)

    if (onSelect) onSelect(newSelectedValues) // Llama al callback con los valores seleccionados
  }

  return (
    <View style={styles.container}>
      {items.map(item => (
        <CheckBox
          key={item.value}
          checked={selectedValues.includes(item.value)}
          onChange={() => handleSelect(item.value)}
        >
          <Text>{item.name}</Text>
        </CheckBox>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  }
})

export default CheckboxGroup
