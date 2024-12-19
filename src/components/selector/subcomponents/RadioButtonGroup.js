import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Radio, RadioGroup, Text, Layout, Divider } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'


const RadioButtonGroup = forwardRef(({ items, onSelect, defaultOption ,error, disabled}, ref) => {
  // Al cargar, selecciona el valor predeterminado si se pasa
  const [selectedIndex, setSelectedIndex] = useState(null)

  function refreshSelector(){
    const index = null
    setSelectedIndex(index !== -1 ? index : null);
    setSelectedIndex(null)
    if (onSelect) onSelect(null)
    return null
  }
  const handleSelect = index => {
    setSelectedIndex(index) // Actualiza el índice seleccionado
    if (onSelect) onSelect(items[index].valor) // Llama al callback con el valor seleccionado
  }

  useImperativeHandle(ref, () => ({
    refreshSelector,
  }))


  return (
    <RadioGroup selectedIndex={selectedIndex} onChange={handleSelect}>
      {items.map(item => (
        <Radio key={item.valor} style={styles.radio}status={error? 'danger':'basic'} disabled = {disabled}>
          <Text style={styles.radioText}>{item.nombre}</Text>
        </Radio>
      ))}
    </RadioGroup>
  )
})

const styles = StyleSheet.create({
  radio: {
    marginVertical: 5,
    fontSize: 17,
  },
  radioText: {
    fontSize: 17, 
  },
})

export default RadioButtonGroup
