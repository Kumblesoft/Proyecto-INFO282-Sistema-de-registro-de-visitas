import React, { forwardRef, useState ,useImperativeHandle } from 'react'
import { CheckBox, Text } from '@ui-kitten/components'
import { View, StyleSheet } from 'react-native'


export default CheckboxGroup = forwardRef(({ items, onSelect, value, maxChecked, error, disabled, defaultOption},ref) => {
  const [selectedItems, setSelectedItems] = useState([]) // Usar el estado como referencia de un Set
  
  const refreshSelector = () =>{
    setSelectedItems([])
    if (onSelect) onSelect(null)
    return null
  }
  useImperativeHandle(ref, () => ({
    refreshSelector,
  }))

  const handleSelect = item => {
    const positionOfItem = selectedItems.indexOf(item.nombre)
    
    let newSelectedItems = [...selectedItems]
    if (positionOfItem !== -1){
      newSelectedItems.splice(positionOfItem, 1)
    } else if (newSelectedItems.length < (maxChecked || items.length)) {
      newSelectedItems.push(item.nombre)
    }

    setSelectedItems(newSelectedItems)
    if (onSelect) onSelect(newSelectedItems) // Llamar al callback con los valores seleccionados (values son los nombres)
  }
  return (
    <View style={styles.container}>
      {items.map(item => (
        <View key={item.value} style={styles.checkboxContainer}>
          <CheckBox
            checked={selectedItems.findIndex(si => si === item.nombre) !== -1} // Verificar si el valor está seleccionado
            onChange={() => handleSelect(item)}
            status={error ? 'danger':'basic'}
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

