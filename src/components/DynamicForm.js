import React from 'react'
import {Alert} from 'react-native'
import {Button, Text, Layout, TouchableOpacity, Icon, IconElement } from '@ui-kitten/components'
import  OptionSelector, { OptionComponentType, OptionSelectorFeatures } from './selector/OptionSelector'
import TextEntry, {OptionalTextFeatures} from './TextEntry' 
import DateSelector, {OptionDateFeatures} from './DateSelector' 
import HourSelector, {OptionalTimeFeatures} from './HourSelector'
import CameraConfiguration, {Camera} from './Camera'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Err, Ok } from '../commonStructures/resultEnum'
import { StyleSheet } from "react-native" 

const tickIcon = (props) => (
    <Icon  name='checkmark-outline' { ...props} />
);
/**
 * A component that renders a dynamic form based on the provided form data.
 *
 * This component handles the state of the form fields, validates required fields,
 * and saves the form data to AsyncStorage when submitted.
 *
 * @param {Object} formData - The data defining the structure and fields of the form.
 * @returns {JSX.Element} The rendered DynamicForm component.
 */


const DynamicForm = ({ formData }) => {
const formState = new Map()


  /**
   * Handles the input change for the form fields.
   *
   * @param {string} field - The field name that is being updated.
   * @param {string} value - The new value for the field.
   */
const handleInputChange = (field, value) => {
    formState.set(field,value)
}

/**
   * Handles the submission of the form.
   *
   * Validates that all required fields are filled before saving the form data
   * to AsyncStorage. If any required fields are empty, an alert is shown.
   */
const handleSubmit = async () => {
    const requiredFields = formData.campos.filter(field => field.obligatorio)
    const emptyFields = requiredFields.some(field => !formState.get(field.salida))
    if (emptyFields) {
        return (new Err('Completa todos los campos obligatorios')).show()
    }
    

    try {
      const savedFormsString = await AsyncStorage.getItem('savedForms')
      let storedForms = []

      if (savedFormsString) {
        storedForms = JSON.parse(savedFormsString)
        if (!Array.isArray(storedForms)) {
          storedForms = []
        }
      }

      const newForm = {
        id: Date.now(), 
        nombreFormulario: formData["nombre formulario"] || "Formulario Sin Nombre", 
        data: formState, 
      }

      
      storedForms.push(newForm) 
      await AsyncStorage.setItem('savedForms', JSON.stringify(storedForms))
      console.log("Formulario guardado:", newForm)
      
      formState.clear()
      Alert.alert("Formulario guardado")
    } catch (error) {
      console.error("Error al guardar el formulario:", error)
    }
  }

  /**
   * Renders a field based on the field type.
   *
   * @param {Object} field - The field data containing type and options.
   * @param {number} index - The index of the field in the form.
   * @returns {JSX.Element|null} The rendered field component or null if the type is unsupported.
   */
const renderField = (field, index) => {  
    switch (field.tipo) {
    case 'selector':
        return (
        <OptionSelector
            key={`selector-${index}`}  
            type={OptionComponentType.DROPDOWN}
            items={field.opciones}
            onSelect={(value) => handleInputChange(field.salida, value)}
            optionalFeatures={OptionSelectorFeatures({
            title: field.nombre,
            defaultOption: field['opcion predeterminada'],
            placeholder: field['texto predeterminado'],
            required: field.obligatorio
            })}
        />
        )
    case 'checkbox':
        return (
        <OptionSelector
            key={`checkbox-${index}`}  
            type={OptionComponentType.CHECKBOX}
            items={field.opciones}
            onSelect={(value) => handleInputChange(field.salida, value)}
            optionalFeatures={OptionSelectorFeatures({
            title: field.nombre,
            defaultOption: field['opcion predeterminada'],
            placeholder: field['texto predeterminado'],
            maxChecked: field['cantidad de elecciones'],
            required: true
            })}
        />
        )
    case 'radio':
        return (
        <OptionSelector
            key={`radio-${index}`}  
            type={OptionComponentType.RADIO}
            items={field.opciones}
            onSelect={(value) => handleInputChange(field.salida, value)}
            optionalFeatures={OptionSelectorFeatures({
            title: field.nombre,
            defaultOption: field['opcion predeterminada'],
            placeholder: field['texto predeterminado'],
            maxChecked: field['cantidad de elecciones'],
            required: true
            })}
        />
        )
    case 'fecha':
        return (
        <DateSelector
            key={`fecha-${index}`}  
            value={formState.get(field.salida)}
            onChange={(value) => handleInputChange(field.salida, value)}
            optionalFeatures={OptionDateFeatures({
            title: field.nombre,
            placeholder: field['texto predeterminado'],
            defaultDate: field['fecha predeterminada'],
            dateFormat: field['formato'],
            disabled: field['limitaciones'].includes('no editable'),
            required: field['obligatorio']
            })}
        />
        )
    case 'hora':
        const now = new Date().getHours().toString().padStart(2, '0') + ':' + new Date().getMinutes().toString().padStart(2, '0')
        return (
        <HourSelector
            key={`hora-${index}`}  
            value={formState.get(field.salida)}
            onChange={(value) => handleInputChange(field.salida, value)}
            optionalFeatures={OptionalTimeFeatures({
            title: field.nombre,
            defaultTime: field['hora predeterminada'] === 'actual' ? now : field['hora predeterminada'],
            disabled: field['limitaciones'].includes('no editable'),
            required: field['obligatorio']
            })}
        />
        )
    case 'camara':
        return (
        <Camera
            key={`camara-${index}`} 
            title={field.nombre}
            required={field['obligatorio']}
            cameraConfiguration={new CameraConfiguration(
            (value) => handleInputChange(field.salida, value),
            field['editable'],
            field['relacion de aspecto']
            )}
        />
        )
    case 'texto':
        return (
            <TextEntry 
                key={`texto-${index}`}
                optionalFeatures={OptionalTextFeatures({
                    title: field.nombre,
                    required: field.obligatorio,
                    limitations: field.limitaciones,
                    format: field.formato
                })}
                onSelect={(value) => handleInputChange(field.salida, value)}
            />
        )
        
    default:
        return null
    }
}

return (
    <Layout style={styles.layoutContainer}>
    {formData.campos.map((field, index) => renderField(field, index))}
    <Button onPress={handleSubmit} style={styles.button} status='primary' accessoryRight={tickIcon}>
        <Text style={styles.buttonText}>Guardar</Text>
    </Button>
    
    </Layout>
)
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        borderColor: "#53a75f"
    },
    buttonText: {
        color: 'white',
        fontWeight: "bold",
        fontSize: 30
    },
    layoutContainer:{
        backgroundColor: "#ffffff"
    }
})

export default DynamicForm
