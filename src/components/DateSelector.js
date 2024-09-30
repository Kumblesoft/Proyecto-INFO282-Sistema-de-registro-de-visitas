import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Text, Datepicker, NativeDateService } from '@ui-kitten/components'


// Función para convertir el formato personalizado al formato de date-fns
const manageDateFormat = (format) => {
  const mapping = {
    'dd': 'dd',  // Día en dos dígitos
    'mm': 'MM',  // Mes en dos dígitos (mayúsculas para el mes)
    'aaaa': 'YYYY',  // Año en cuatro dígitos
  }

  // Reemplaza cualquier instancia de los formatos personalizados con los de date-fns
  return format
    .replace(/dd/, mapping['dd'])
    .replace(/mm/, mapping['mm'])
    .replace(/aaaa/, mapping['aaaa'])
}

export const OptionDateFeatures = (options = {}) => {
  return {
    title: options.title ?? "", // Valor por defecto
    defaultDate: options.defaultOption === "hoy" ? new Date() : options.defaultOption ?? new Date(),
    dateFormat: manageDateFormat(options.dateFormat ?? 'dd/MM/yyyy') , // Formato de fecha por defecto
    disabled: options.disabled ?? false, // Deshabilitado por defecto en falso
    required: options.required ?? false, // Requerido por defecto en falso
  }
}

const DateSelector = ({ onChange, optionalFeatures = {} }) => {
  const { title, defaultDate, dateFormat, required, disabled } = optionalFeatures
  const [selectedDate, setSelectedDate] = useState(defaultDate ? new Date(defaultDate) : null)

  const configuredDateService = new NativeDateService('en', { format: dateFormat })
  // Solo ejecutar el efecto una vez cuando el componente está deshabilitado
  useEffect(() => {
    if (disabled && defaultDate) {
      const formattedDate = configuredDateService.format(new Date(defaultDate), dateFormat)
      console.log(dateFormat)
      onChange(formattedDate)  // Actualiza solo una vez si está deshabilitado
      setSelectedDate(new Date(defaultDate)) // Establece la fecha predeterminada
    }
    // Añadimos una condición para que solo se ejecute una vez si está deshabilitado
  }, [disabled])

  const handleDateChange = (nextDate) => {
    setSelectedDate(nextDate)
    const formattedDate = nextDate ? configuredDateService.format(nextDate, dateFormat) : ""
    onChange(formattedDate)
  }

  return (
    <View style={{ marginVertical: 10 }}>
      {title && (
        <Text category="h6">
          {title}
          {required ? "*" : ""}
        </Text>
      )}
      <Datepicker
        date={selectedDate}
        dateService={configuredDateService}
        onSelect={handleDateChange}
        disabled={disabled}
      />
    </View>
  )
}

export default DateSelector
