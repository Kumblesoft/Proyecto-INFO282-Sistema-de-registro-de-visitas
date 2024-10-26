import React, { useRef } from 'react'
import { Button, Alert } from 'react-native'
import { Layout } from '@ui-kitten/components'
import TextEntry, { OptionalTextFeatures } from './TextEntry1'
import DateSelector, {OptionDateFeatures} from './DateSelector' 
import HourSelector, {OptionalTimeFeatures} from './HourSelector'
import CameraConfiguration, {Camera} from './Camera'
import AsyncStorage from '@react-native-async-storage/async-storage'
import  OptionSelector, { OptionComponentType, OptionSelectorFeatures } from './selector/OptionSelector'

const DynamicForm = ({ formData }) => {
  const formState = new Map()
  const requiredFieldRefs = useRef([])  

  const handleInputChange = (field, value) => {
    formState.set(field, value)
  }

  const handleSubmit = async () => {
    const requiredFields = formData.campos.filter(field => field.obligatorio)
    const emptyFields = requiredFields.some(field => !formState.get(field.salida))

    // Verificamos los obligatorios
  
    if (emptyFields) {
      requiredFieldRefs.current.forEach(ref => ref())
      return Alert.alert('Completa todos los campos obligatorios')
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

  const renderField = (field, index) => {
      const requiredFieldRef = useRef(null)
      
      switch (field.tipo) {
      case 'selector':
        requiredFieldRefs.current.push(() => requiredFieldRef.current())  // Añadir la referencia al array
        return (
        <OptionSelector
            key={`selector-${index}`}  
            type={OptionComponentType.DROPDOWN}
            items={field.opciones}
            onSelect={(value) => handleInputChange(field.salida, value)}
            requiredFieldRef={requiredFieldRef}  
            optionalFeatures={OptionSelectorFeatures({
            title: field.nombre,
            defaultOption: field['opcion predeterminada'],
            placeholder: field['texto predeterminado'],
            required: field.obligatorio
            })}
        />
        )
    case 'checkbox':
      requiredFieldRefs.current.push(() => requiredFieldRef.current())  // Añadir la referencia al array
        return (
        <OptionSelector
            key={`checkbox-${index}`}  
            type={OptionComponentType.CHECKBOX}
            items={field.opciones}
            onSelect={(value) => handleInputChange(field.salida, value)}
            requiredFieldRef={requiredFieldRef}
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
      requiredFieldRefs.current.push(() => requiredFieldRef.current())  // Añadir la referencia al array
        return (
        <OptionSelector
            key={`radio-${index}`}  
            type={OptionComponentType.RADIO}
            items={field.opciones}
            onSelect={(value) => handleInputChange(field.salida, value)}
            requiredFieldRef={requiredFieldRef}
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
        requiredFieldRefs.current.push(() => requiredFieldRef.current())  // Añadir la referencia al array
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
            requiredFieldRef={requiredFieldRef}  // Pasar la referencia al componente TextEntry
          />
        )
      default:
        return null
    }
  }

  return (
    <Layout>
      {formData.campos.map((field, index) => renderField(field, index))}
      <Button title="Enviar" onPress={handleSubmit} />
    </Layout>
  )
}

export default DynamicForm
