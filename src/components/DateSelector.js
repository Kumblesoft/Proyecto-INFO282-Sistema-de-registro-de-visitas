import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Text, Datepicker, NativeDateService } from '@ui-kitten/components'

/**
 * Converts a custom date format to a format compatible with date-fns.
 *
 * @param {string} format - The custom date format string.
 * @returns {string} The converted format compatible with date-fns.
 */
const manageDateFormat = (format) => {
  const mapping = {
    'dd': 'dd',  // Day in two digits
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
    defaultDate: options.defaultOption === "hoy" ? new Date() : options.defaultOption ?? new Date(),
    dateFormat: manageDateFormat(options.dateFormat ?? 'dd/MM/yyyy'),
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
const DateSelector = ({ onChange, optionalFeatures}) => {
  const {
    title = "",
    defaultDate = new Date(),
    dateFormat = 'dd/MM/yyyy',
    required = false,
    disabled = false
  } = optionalFeatures ?? {}

  const [selectedDate, setSelectedDate] = useState(defaultDate ? new Date(defaultDate) : null)

  const configuredDateService = new NativeDateService('en', { format: dateFormat })

  useEffect(() => {
    if (disabled && defaultDate) {
      const formattedDate = configuredDateService.format(new Date(defaultDate), dateFormat)
      onChange(formattedDate)
      setSelectedDate(new Date(defaultDate))
    }
  }, [disabled])

  /**
   * Handles changes to the selected date.
   *
   * @param {Date} nextDate - The newly selected date.
   */
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
