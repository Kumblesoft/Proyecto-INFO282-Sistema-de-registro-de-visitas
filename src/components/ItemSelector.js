import React, { useState } from 'react'
import { Select, SelectItem } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'

const ItemSelector = ({ items, onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(null) // Índice seleccionado
  const [selectedValue, setSelectedValue] = useState(null) // Valor inicial

  const handleSelect = index => {
    const selectedItem = items[index.row] // Obtén el elemento seleccionado usando el índice

    setSelectedIndex(index) // Actualiza el índice seleccionado
    setSelectedValue(selectedItem.name) // Actualiza el valor que se muestra en el `Select`

    if (onSelect) onSelect(selectedItem.value) // Llama al callback con el valor seleccionado
  }

  return (
    <Select
      selectedIndex={selectedIndex}
      onSelect={handleSelect}
      placeholder="Selecciona una opción" // Placeholder para el Select
      value={selectedValue} // Muestra el valor seleccionado o el placeholder
      style={styles.select} // Aplica estilo para el ancho mínimo
    >
      {items.map((item, index) => (
        <SelectItem key={index} title={item.name} /> // Crea las opciones del dropdown
      ))}
    </Select>
  )
}

const styles = StyleSheet.create({
  select: {
    minWidth: 300, // Establece un ancho mínimo
  }
})

export default ItemSelector
