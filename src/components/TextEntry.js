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
 * Map that defines the validator functions and behaviour of each limitation 
 */
const limitationBehaviour = new Map([
  ["solo letras", {
    regex: ((/^[a-zA-Z\s]*$/)),
    keyboardType: "default"
  }], 
  ["no numeros", {
    regex: !(/[0-9]/),
    keyboardType: "default"
  }],
  ["solo numeros", {
    regex: /^-?\d+([.,]\d+)?$/,
    keyboardType: "numeric"
  }],
  ["solo enteros", {
    regex: /^-?\d+$/,
    keyboardType: "numeric"
  }],
  ["solo enteros positivos y cero", {
    regex: text => /^\d+$/,
    keyboardType: "numeric"
  }],
  ["email", {
    regex: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
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
      setInvalidLimitations([])
      return new Ok("Empty string")
    }

    console.log(limitationBehaviour.get(limitations.at(0)))
    console.log(limitations)
    setInvalidLimitations(
      limitations.reduce((acc, limName) => {
        if (!limitationBehaviour.get(limName).regex.test(limName)) {
          const limitationName = String.fromCharCode(limName.charCodeAt(0) - 32) + limName.substr(1)
          acc.push(limitationName) 
        }
        return acc
    }, []))

    console.log(invalidLimitations)

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
        keyboardType={limitations && limitations.map(name => (limitationBehaviour.get(name).keyboardType))} // Solo números
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
