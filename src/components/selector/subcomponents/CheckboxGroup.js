import React, { forwardRef, useState ,useImperativeHandle } from 'react'
import { CheckBox, Text } from '@ui-kitten/components'
import { View, StyleSheet } from 'react-native'


export default CheckboxGroup = forwardRef(({ items, onSelect, value, maxChecked, error, disabled, defaultOption},ref) => {
  const [selectedValues] = useState(new Set()) // Usar el estado como referencia de un Set
  if (value) [value].flat().map(value => selectedValues.add(value)) // Setear los valores iniciales

  const refreshSelector = () =>{
    items.map(item => selectedValues.has(item.valor) ? handleSelect(item.valor) : null)
    selectedValues.clear()
    if (onSelect) onSelect(null)
    return null
  }
  useImperativeHandle(ref, () => ({
    refreshSelector,
  }))

  const handleSelect = itemValue => {
    if (selectedValues.has(itemValue)) selectedValues.delete(itemValue) // Eliminar si ya estaba seleccionado
    else if (selectedValues.size < (maxChecked || items.length)) selectedValues.add(itemValue) // Añadir si no está seleccionado y no excede el límite

		if (onSelect) onSelect(Array.from(selectedValues)) // Llamar al callback con los valores seleccionados
  }
  return (
    <View style={styles.container}>
      {items.map(item => (
        <View key={item.value} style={styles.checkboxContainer}>
          <CheckBox
            checked={selectedValues.has(item.valor)} // Verificar si el valor está seleccionado
            onChange={() => handleSelect(item.valor)}
            status={error? 'danger':'basic'}
            disabled={disabled}
            style={styles.checkbox} // Estilo personalizado
          >
            <Text style={styles.checkboxText}>{item.nombre}</Text> {/* Texto más grande */}
          </CheckBox>
        </View>
      ))}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  },
  checkboxContainer: {
    marginVertical: 5, // Espacio entre los checkboxes
  },
  checkboxText: {
    fontSize: 17, // Tamaño de fuente más grande
  }
})

