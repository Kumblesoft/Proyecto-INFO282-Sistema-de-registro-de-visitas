import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { IndexPath, Select, SelectItem } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'



const ItemSelector = forwardRef(({ items, onSelect, value, defaultOption, placeholder, error, disabled }, ref) => {
  
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(new IndexPath(defaultOption)) // Índice seleccionado
  const [selectedValue, setSelectedValue] = useState(items[defaultOption].nombre) // Valor inicial

  function refreshSelector() {
    
    setSelectedOptionIndex(new IndexPath(defaultOption))
    setSelectedValue(items[defaultOption].nombre)
    if (onSelect) onSelect(items[defaultOption].valor)
    return items[defaultOption].valor
  }
  useImperativeHandle(ref, () => ({
    refreshSelector,
  }))

  const handleSelect = index => {
    const selectedItem = items[index.row] // Obtén el elemento seleccionado usando el índice

    setSelectedOptionIndex(new IndexPath(index)) // Actualiza el índice seleccionado
    setSelectedValue(selectedItem.nombre) // Cambia aquí para mostrar el nombre

    if (onSelect) onSelect(selectedItem.valor) // Llama al callback con el valor seleccionado
  }

  return (
    <Select
      selectedIndex={selectedOptionIndex}
      onSelect={handleSelect}
      status={error ? 'danger' : 'primary'}
      disabled={disabled}
      placeholder={placeholder} // Placeholder para el Select
      style={styles.select} // Aplica estilo para el ancho mínimo 
      value={selectedValue}
    >
      {items.map(item => (
        <SelectItem key={item.valor} title={item.nombre} style={styles.colorItem} /> // Crea las opciones del dropdown
      ))}
    </Select>
  )
})

const styles = StyleSheet.create({
  select: {
    minWidth: 300, // Establece un ancho mínimo
    borderColor: '#fff'
  }
})

export default ItemSelector
