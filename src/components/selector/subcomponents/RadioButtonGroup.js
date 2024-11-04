import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Radio, RadioGroup, Text, Layout, Divider } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'


const RadioButtonGroup = forwardRef(({ items, onSelect, defaultOption,error }, ref) => {
  // Al cargar, selecciona el valor predeterminado si se pasa
  const [selectedIndex, setSelectedIndex] = useState(null)

  function refreshSelector(){
    setSelectedIndex(null)
  }

  useImperativeHandle(ref, () => ({
    refreshSelector,
  }));
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
        <Radio key={item.valor} style={styles.radio}status={error? 'danger':'basic'}>
          <Text style={styles.radioText}>{item.nombre}</Text>
        </Radio>
      ))}
    </RadioGroup>
  )
})

const styles = StyleSheet.create({
  radio: {
    marginVertical: 5,
    fontSize: 18,
  },
  radioText: {
    fontSize: 18, 
  },
})

export default RadioButtonGroup
