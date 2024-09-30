// SaveButton.js
import React from 'react' // Importa React para crear el componente
import { Alert } from 'react-native' // Importa Alert para mostrar mensajes al usuario
import AsyncStorage from '@react-native-async-storage/async-storage' // Importa AsyncStorage para el almacenamiento local
import { useNavigation } from '@react-navigation/native' // Importa useNavigation para navegar entre pantallas

/**
 * Componente SaveButton
 *
 * Este componente maneja la lógica para guardar un formulario utilizando AsyncStorage.
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.title - Título del formulario a guardar.
 * @param {Object} props.formData - Datos del formulario que se van a guardar.
 * 
 * @returns {Object} Contiene la función handleSubmit para guardar los datos.
 */
const SaveButton = ({ title, formData }) => {
    const navigation = useNavigation() // Hook para la navegación entre pantallas

    /**
     * Función para manejar el envío de datos del formulario.
     * Verifica si todos los campos están rellenados y guarda los datos en AsyncStorage.
     * Muestra alertas al usuario en caso de éxito o error.
     *
     * @async
     * @function handleSubmit
     * @returns {Promise<void>}
     */
    const handleSubmit = async () => {
        // Verificar que todos los campos de texto estén rellenados
        const allFieldsFilled = true // Reemplazar esta línea con la lógica real de validación
        if (!allFieldsFilled) {
            Alert.alert('Error', 'Debe rellenar todos los campos de texto') // Alerta si hay campos vacíos
            return // Salir si no están todos los campos rellenos
        }

        try {
            // Obtener los formularios guardados
            const existingForms = JSON.parse(await AsyncStorage.getItem('savedForms')) || [] // Obtener formularios existentes o iniciar con un arreglo vacío

            // Crea un formulario para guardar
            const newForm = {
                id: Date.now().toString(), // Generar un ID único basado en la fecha y hora actual
                nombreFormulario: title || 'Formulario Sin Nombre', // Usar el título pasado o un valor por defecto
                datos: formData, // Datos del formulario a guardar
            }
            // Imprimir en consola los datos que se van a guardar
            console.log("Datos que se guardarán:", newForm);

            // Guarda el formulario
            await AsyncStorage.setItem('savedForms', JSON.stringify([...existingForms, newForm])) // Guardar el nuevo formulario junto a los existentes

            Alert.alert('Éxito', 'Datos guardados correctamente') // Alerta de éxito

            // Regresar a la pantalla anterior
            navigation.goBack()

        } catch (error) {
            console.error('Error al guardar los datos:', error) // Imprimir error en consola
            Alert.alert('Error', 'No se pudo guardar los datos') // Alerta de error
        }
    }

    // Retornar la función handleSubmit para que pueda ser utilizada en otros componentes
    return { handleSubmit }
}

export default SaveButton // Exportar el componente
