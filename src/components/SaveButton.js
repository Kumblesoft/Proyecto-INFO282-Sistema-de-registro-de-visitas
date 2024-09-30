// SaveButton.js
import React from 'react'
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'

const SaveButton = ({title, formData,}) => {
    const navigation = useNavigation()

    const handleSubmit = async () => {
    // Verificar que todos los campos de texto estén rellenados
    //const allFieldsFilled = Object.values(formData).every(value => value.trim() !== '')
    const allFieldsFilled = true
    if (!allFieldsFilled) {
        Alert.alert('Error', 'Debe rellenar todos los campos de texto')
    }

    try {
      // Obtener los formularios guardados
        const existingForms = JSON.parse(await AsyncStorage.getItem('savedForms')) || []

      // Crea un form para guardar
        const newForm = {
        id: Date.now().toString(), // Generar un ID único
        nombreFormulario: title || 'Formulario Sin Nombre', 
        datos:formData,
        }
         // Imprimir en consola los datos que se van a guardar
        console.log("Datos que se guardarán:", newForm);
      // Guarda el formulario
        await AsyncStorage.setItem('savedForms', JSON.stringify([...existingForms, newForm]))

        Alert.alert('Éxito', 'Datos guardados correctamente')

      // vuelve a la pantalla anterior
        navigation.goBack()

    } catch (error) {
        console.error('Error al guardar los datos:', error)
        Alert.alert('Error', 'No se pudo guardar los datos')
    }
    }

    return { handleSubmit }
}

export default SaveButton
