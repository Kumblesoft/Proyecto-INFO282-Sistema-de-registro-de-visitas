import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Datepicker, NativeDateService, Layout } from '@ui-kitten/components'

/**
 * Converts a custom date format to a format compatible with date-fns.
 *
 * @param {string} format - The custom date format string.
 * @returns {string} The converted format compatible with date-fns.
 */
const manageDateFormat = (format) => {
  const mapping = {
    'dd': 'DD',  // Day in two digits
    'mm': 'MM',  // Month in two digits (uppercase for month)
    'aaaa': 'YYYY',  // Year in four digits
  }

  return format
    .replace(/dd/, mapping['dd'])
    .replace(/mm/, mapping['mm'])
    .replace(/aaaa/, mapping['aaaa'])
}

/**
 * Represents optional features for the DateSelector component.
 *
 * @param {Object} options - Options for configuring the DateSelector.
 * @param {string} [options.title] - The title displayed above the date picker.
 * @param {string} [options.defaultOption] - Default date value can be 'hoy' for today's date.
 * @param {string} [options.dateFormat] - The format of the date displayed.
 * @param {boolean} [options.disabled=false] - Whether the date picker is disabled.
 * @param {boolean} [options.required=false] - Whether the field is required.
 * @returns {Object} An object containing the defined optional features.
 */
export const OptionDateFeatures = (options ={}) => {
  return {
    title: options.title ?? "",
    defaultDate: options.defaultDate === "hoy" ? new Date() : new Date(options.defaultDate),
    dateFormat: manageDateFormat(options.dateFormat ?? 'DD/MM/YYYY'),
    disabled: options.disabled ?? false,
    required: options.required ?? false,
  }
}

/**
 * A component that allows users to select a date.
 *
 * @param {Function} onChange - Callback function called when the selected date changes.
 * @param {Object} optionalFeatures - Configuration options for the DateSelector.
 * @returns {JSX.Element} The rendered DateSelector component.
 */
const DateSelector = ({value, onChange, optionalFeatures}) => {
  const hasInitialized = useRef(false)
  const {
    title = "",
    defaultDate = new Date(),
    dateFormat = 'DD/MM/YYYY',
    required = false,
    disabled = false
  } = optionalFeatures ?? {}

  const [selectedDate, setSelectedDate] = useState(null)
  const configuredDateService = new NativeDateService('en', {
    startDayOfWeek:1,
    format: dateFormat
  })
  useEffect(() => {
    if (defaultDate && !hasInitialized.current) {
      setSelectedDate(defaultDate) 
      const formattedDate = configuredDateService.format(defaultDate, dateFormat)
      onChange(formattedDate)
      hasInitialized.current = true
    }
  }, [onChange, defaultDate])

  /**
   * Handles changes to the selected date.
   *
   * @param {Date} nextDate - The newly selected date.
   */
  const handleDateChange = (nextDate) => {
    setSelectedDate(nextDate)
    const formattedDate = configuredDateService.format(nextDate, dateFormat)
    onChange(formattedDate)
  }

  return (
    <Layout style={styles.containerBox}>
      {title && (
        <Text category="h6" style={styles.titles}>
          {title}
          {required ? "*" : ""}
        </Text>
      )}
      <Datepicker
        date={selectedDate}
        dateService={configuredDateService}
        onSelect={handleDateChange}
        disabled={disabled}
        style={styles.datepicker}
      />
    </Layout>
  )
}

const styles = StyleSheet.create({
  titles: {
        fontWeight: 'bold',
        marginBottom: 10,
        margin: 2,
  },
  containerBox: {
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#ffffff', // Color fondo suave
    borderWidth: 1,
    borderColor: '#9beba5',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 3,
    alignItems: 'flex-start'
  },
  datepicker: {
    width: 360,
  }
})

export default DateSelector