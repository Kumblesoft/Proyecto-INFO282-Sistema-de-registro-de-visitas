// SaveButton.js
import React from 'react'
import { Alert } from 'react-native'
import * as FileSystem from 'expo-file-system'

const SaveButton = ({ textData, selectedOptions, selectedRadio, date, onSave }) => {

const handleSubmit = async () => {    // Verificar que todos los campos de texto estén rellenados
    const allFieldsFilled = Object.values(textData).every(value => value.trim() !== '')

    if (!allFieldsFilled) {
        Alert.alert('Error', 'Debe rellenar todos los campos de texto')
        return
    }

    try {
        const dataToSave = { selectedOptions, selectedRadio, date, textData }
        console.log('Datos guardados:', dataToSave)

      // Guardar datos como JSON
      // const fileUri = FileSystem.documentDirectory + 'formData.json'
      // await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(dataToSave))
      // console.log('Datos guardados en:', fileUri)

        Alert.alert('Éxito', 'Datos guardados correctamente')
      // Llama a la función externa después de guardar
        if (onSave) {
        onSave(dataToSave)
    }

    } catch (error) {
        console.error('Error al guardar los datos:', error)
        Alert.alert('Error', 'No se pudo guardar los datos')
    }
}

    return { handleSubmit }
}

export default SaveButton
