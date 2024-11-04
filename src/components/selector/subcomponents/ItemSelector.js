import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Select, SelectItem } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'



const ItemSelector = forwardRef(({ items, onSelect, value,defaultOption, placeholder,error }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(null) // Índice seleccionado
  const [selectedValue, setSelectedValue] = useState(null) // Valor inicial


  function refreshSelector(){
    setSelectedIndex(null)
    setSelectedValue(null)
  }
  useImperativeHandle(ref, () => ({
    refreshSelector,
  }))

  const handleSelect = index => {
    const selectedItem = items[index.row] // Obtén el elemento seleccionado usando el índice

    setSelectedIndex(index) // Actualiza el índice seleccionado
    setSelectedValue(selectedItem.nombre) // Cambia aquí para mostrar el nombre

    if (onSelect) onSelect(selectedItem.valor) // Llama al callback con el valor seleccionado
  }

  useEffect(() => {
    const selectedItem = items.find(item => item.valor === value) // Encuentra el elemento por el valor
    setSelectedValue(selectedItem ? selectedItem.nombre : null) // Muestra el nombre si se encuentra, o null
  }, [value, items])

  return (
    <Select
      selectedIndex={selectedIndex}
      onSelect={handleSelect}
      status={error? 'danger':'primary'}
      placeholder={placeholder} // Placeholder para el Select
      value={selectedValue} // Muestra el nombre seleccionado o el placeholder
      style={styles.select} // Aplica estilo para el ancho mínimo
    >
      {items.map(item => (
        <SelectItem key={item.valor} title={item.nombre} style={styles.colorItem}/> // Crea las opciones del dropdown
      ))}
    </Select>
  )
})

const styles = StyleSheet.create({
  select: {
    minWidth: 300, // Establece un ancho mínimo
  }
})

export default ItemSelector
