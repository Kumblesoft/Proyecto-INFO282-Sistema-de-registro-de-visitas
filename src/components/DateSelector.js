import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Layout, Icon, Datepicker, NativeDateService } from '@ui-kitten/components'
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
const DateSelector = ({value, onChange, optionalFeatures,requiredFieldRef}) => {
  const hasInitialized = useRef(false)
  const {
    title = "",
    defaultDate = new Date(),
    dateFormat = 'DD/MM/YYYY',
    required = false,
    disabled = false
  } = optionalFeatures ?? {}

  const [selectedDate, setSelectedDate] = useState(null)
  const [isRequiredAlert, setIsRequiredAlert] = useState(null)
  const configuredDateService = new NativeDateService('en', {
    startDayOfWeek:1,
    format: dateFormat
  })
  useEffect(() => {
    if (defaultDate && !hasInitialized.current) {
      setSelectedDate(defaultDate) 
      const formattedDate = configuredDateService.format(defaultDate, dateFormat)
      onChange(formattedDate)
      setIsRequiredAlert(false)
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
    setIsRequiredAlert(false)
  }

  requiredFieldRef.current = () => {
    if (required && !selectedDate) {
        setIsRequiredAlert(true)
    } else {
        setIsRequiredAlert(false)
    }
  }


  return (
    <View style={{ marginVertical: 10 }}>
      {title && (
        <View style={styles.text}>
          <Text style={styles.text} category={required ? "label" :"p2"}>
            {title}
          </Text> 
          <Text status='danger'> 
            {required ? "*": " "} 
          </Text>
        </View>
      )}
      <Datepicker
        date={selectedDate}
        dateService={configuredDateService}
        onSelect={handleDateChange}
        disabled={disabled}
      />
      { isRequiredAlert ?
        <Layout size='small' style={styles.alert}>
          <Icon status='danger' fill='#FF0000' name='alert-circle'style={styles.icon}/> 
          <Text style={styles.alert} category="p2">
            Por favor seleccione una fecha
          </Text>
        </Layout>
        :
        <></>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    marginHorizontal: '1%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  alert: {
    flex: 1,
    margin: 1,
    marginHorizontal: '1%',
    color: '#ff0000',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  icon: {
    width: 20,
    height: 20,
  },
})

export default DateSelector
