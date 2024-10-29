import React, { useState } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { Text, Input, Button, Layout, ViewPager, Icon } from '@ui-kitten/components'
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
  ["solo enteros", text => /^-?\d+$/.test(text)] // Acepta solo enteros (positivos o negativos)
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
const TextEntry = ({ optionalFeatures, onSelect, requiredFieldRef, refreshFieldRef}) => {
  const { title, required, limitations, format } = optionalFeatures
  const [ inputValue, setInputValue ] = useState('')
  const [ isRequiredAlert, setIsRequiredAlert] = useState(false)
  const [ isValidInput, setIsValidInput ] = useState(true)

  /**
   * Handles changes to the input field and validates the input against specified limitations.
   *
   * @param {string} text - The new input value.
   */
  const handleChange = text => {
    
    // Limitations
    if (text === "") {
      setIsValidInput(true)
      return new Ok("Empty string")
    }

    setIsValidInput(limitations.every(limitation => limitationMap.get(limitation)(text)))
    if (!isValidInput) return new Err("No cumple las limitaciones")
      
    // Formatting
    let formattedText = text
    format.forEach(formattingOption => {
      const formatFunction = formatMap.get(formattingOption)
      if (formatFunction) formattedText = formatFunction(formattedText)
    })
    setInputValue(formattedText)
    onSelect(formattedText) 
    setIsRequiredAlert(false) 
    return new Ok("Correct input")
  }


    // Cambiar el estilo
    requiredFieldRef.current = () => {
      if (required && !inputValue) {
        setIsRequiredAlert(true)
      } else {
        setIsRequiredAlert(false)
      }
    }
    refreshFieldRef.current = () => {
      setInputValue('')
    }

  return (
    <View style={styles.container}>
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

      <Input style={[styles.input, isRequiredAlert && { borderColor: '#ff0000', }]} value={inputValue} onChangeText={handleChange} />
      { isRequiredAlert ?
        <Layout size='small' style={styles.alert}>
          <Icon status='danger' fill='#FF0000' name='alert-circle'style={styles.icon}/> 
          <Text style={styles.alert} category="p2">
            Por favor rellene este campo
          </Text>
        </Layout>
        :
        <></>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
    flexWrap:'wrap',
    justifyContent: 'left',
  },
  label: {
    fontSize: 10,
    color: '#333',
  },
  text: {
    marginHorizontal: '2%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  alert: {
    flex: 1,
    margin: 1,
    marginHorizontal: '3%',
    color: '#ff0000',
    top: -10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  icon: {
    width: 20,
    height: 20,
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