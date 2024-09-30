import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Input } from '@ui-kitten/components'

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
 * A component for text entry that allows users to input text with optional validation.
 *
 * @param {Object} props - Props for the TextEntry component.
 * @param {Object} props.optionalFeatures - Configuration options for the TextEntry.
 * @param {Function} props.onSelect - Callback function called when the input value changes.
 * @returns {JSX.Element} The rendered TextEntry component.
 */
const TextEntry = ({ optionalFeatures, onSelect }) => {
  const { title, required, limitations, format } = optionalFeatures
  const [inputValue, setInputValue] = useState('')

  /**
   * Handles changes to the input field and validates the input against specified limitations.
   *
   * @param {string} text - The new input value.
   */
  const handleChange = (text) => {
    let isValid = true

    if (limitations.includes("solo letras")) {
      const regex = /^[a-zA-Z\s]*$/ 
      isValid = regex.test(text)
    }

    if (limitations.includes("no numeros")) {
      const regex = /[0-9]/ 
      isValid = isValid && !regex.test(text)
    }
    if (limitations.includes("solo numeros")) {
      const regex = /[0-9]/ 
      isValid = regex.test(text)
    }

    if (isValid) {

      let formattedText = text
      format.forEach(condition => {
        if (condition === "solo mayusculas") {
          formattedText = formattedText.toUpperCase() 
        }
        if (condition === "solo minusculas") {
          formattedText = formattedText.toLowerCase() 
        }
      })

      setInputValue(formattedText)
      onSelect(formattedText) 
    }
  }

  return (
    <View style={styles.container}>
      {title && (
        <Text category="h6" style={styles.label}>
          {title}
          {required ? "*" : ""}
        </Text>
      )}
      <Input
        style={styles.input}
        value={inputValue}
        onChangeText={handleChange} 
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
