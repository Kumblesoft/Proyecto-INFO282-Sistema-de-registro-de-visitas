import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Input } from '@ui-kitten/components'
import { Err, Ok } from '../commonStructures/resultEnum'

/**
 * Represents optional features for the TextEntry component.
 * 
 * @param {Object} options - Options for configuring the TextEntry component.
 * @param {string} [options.title] - The title displayed above the input field.
 * @param {boolean} [options.required=false] - Indicates if the field is required.
 * @param {Array<string>} [options.limitations=[]] - An array of limitations for the input value.
 *        Example: ["solo letras"] to restrict input to letters only.
 * @param {Array<string>} [options.format=[]] - An array of conditions to format the input value.
 * @returns {Object} An object containing the defined optional features.
 */
export const OptionalTextFeatures = (options = {}) => {
  return {
    title: options.title ?? "",
    required: options.required ?? false,
    limitations: options.limitations ?? [], 
    format: options.format ?? []
  }
}

/**
 * Map that defines the validator functions for each limitation
 */
const limitationMap = new Map([
  ["solo letras", text => ((/^[a-zA-Z\s]*$/)).test(text)],
  ["no numeros", text => !(/[0-9]/).test(text)],
  ["solo numeros", text => /^-?\d+([.,]\d+)?$/.test(text)], // Acepta solo números reales (incluyendo negativos y decimales con punto)
  ["solo enteros", text => /^-?\d+$/.test(text)], // Acepta solo enteros (positivos o negativos)
  ["solo enteros positivos y cero", text => /^\d+$/.test(text)]
])

const limitationBehaviour = new Map([
  ["solo letras", {
    validationFunction: text => ((/^[a-zA-Z\s]*$/)).test(text),
    keyboardType: "default"
  }], 
  ["no numeros", {
    validationFunction: text => !(/[0-9]/).test(text),
    keyboardType: "default"
  }],
  ["solo numeros", {
    validationFunction: text => /^-?\d+([.,]\d+)?$/.test(text),
    keyboardType: "numeric"
  }],
  ["solo enteros", {
    validationFunction: text => /^-?\d+$/.test(text),
    keyboardType: "numeric"
  }],
  ["solo enteros positivos y cero", {
    validationFunction: text => /^\d+$/.test(text),
    keyboardType: "numeric"
  }],
  ["email", {
    validationFunction: text => /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(text),
    keyboardType: "default"
  }]
])


/**
 * Map that defines transformation functions as formatting for the fields
 */
const formatMap = new Map([
  ["solo mayusculas", input => input.toUpperCase()],
  ["solo minusculas", input => input.toUpperCase()]
])


/**
 * A component for text entry that allows users to input text with optional validation.
 *
 * @param {Object} props - Props for the TextEntry component.
 * @param {Object} props.optionalFeatures - Configuration options for the TextEntry.
 * @param {Function} props.onSelect - Callback function called when the input value changes.
 * @returns {JSX.Element} The rendered TextEntry component.
 */
const TextEntry = ({ optionalFeatures, onSelect }) => {
  const { title, required, limitations, format } = optionalFeatures
  const [ inputValue, setInputValue ] = useState('')

  const [ invalidLimitations, setInvalidLimitations ] = useState([])

  /**
   * Handles changes to the input field and validates the input against specified limitations.
   *
   * @param {string} text - The new input value.
   */
  const handleChange = text => {
    
    // Limitations
    if (text === '') {
      setInvalidLimitations('')
      return new Ok("Empty string")
    }

    const tempInvalidLimitations = []
    limitations.map(limitation => {
      if (!limitationMap.get(limitation)(text)) {
        const limitationName = String.fromCharCode(limitation.charCodeAt(0) - 32) + limitation.substr(1)
        tempInvalidLimitations.push(limitationName) 
      }
    })
    setInvalidLimitations(tempInvalidLimitations)
    console.log(limitationBehaviour.get(limitations.at(0)).keyboardType)


    if (invalidLimitations.length) return new Err("No cumple las limitaciones")
      
    // Formatting
    const formattedText = format.forEach(formattingOption => text = formatMap.get(formattingOption)(text))
    setInputValue(formattedText)
    onSelect(formattedText)   
    return new Ok("Correct input")
  }

  return (
    <View style={styles.container}>
      {title && (
        <Text category="h6" style={styles.label}>
          {title}
          {required ? "*" : ""}
        </Text>
      )}
      { invalidLimitations.length ? invalidLimitations.map(name => <Text style={{ color: 'red' }}> -{name} </Text>) : <></>}
      <Input
        style={styles.input}
        value={inputValue}
        onChangeText={handleChange} 
        keyboardType={limitations} // Solo números
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  label: {
    fontSize: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 15,
  },
})

export default TextEntry
