import React, { useState } from 'react'
import * as eva from '@eva-design/eva'
import { ApplicationProvider, Datepicker, Button, Text } from '@ui-kitten/components'
import * as FileSystem from 'expo-file-system'
import { StyleSheet, View, ScrollView, Alert } from 'react-native'
import ItemSelector from "./components/ItemSelector" // Importa el componente ItemSelector
import CheckboxGroup from "./components/CheckboxGroup" // Importa el componente CheckboxGroup
import RadioButtonGroup from "./components/RadioButtonGroup" // Importa el nuevo componente RadioButtonGroup
import EntradaTexto from "./components/EntradaTexto"

// Opciones para el select
const testItems = [
  { value: 'option1', name: 'Opción 1' },
  { value: 'option2', name: 'Opción 2' },
  { value: 'option3', name: 'Opción 3' }
]

// Campos del formulario
const testFields = {
  nombre: '',
  email: '',
  telefono: '',
}

export default function App() {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState(testFields)
  const [date, setDate] = useState(new Date())
  const [selectedOptions, setSelectedOptions] = useState([])
  const [selectedRadio, setSelectedRadio] = useState(null)

  // Callback para cuando se seleccione una opción en el select
  const handleSelect = value => {
    console.log("Valor seleccionado:", value)
  }

  // Callback para cuando se seleccionen opciones en los checkboxes
  const handleCheckboxSelect = values => {
    console.log("Valores seleccionados en checkboxes:", values)
    setSelectedOptions(values) // Actualiza el estado con los valores seleccionados
  }

  // Callback para cuando se seleccione una opción en los radio buttons
  const handleRadioSelect = value => {
    console.log("Valor seleccionado en radio buttons:", value)
    setSelectedRadio(value) // Actualiza el estado con el valor seleccionado
  }

  // Callback para manejar cambios en los campos
  const handleChange = (name, value) => {
    //console.log("Valor seleccionado en", name, ":", value)
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Guardar datos en archivo local (esto está simulado)
  const handleSubmit = async () => {
    // Verificar que todos los campos del formulario estén rellenados
    const allFieldsFilled = Object.values(formData).every(value => value.trim() !== '')

    if (!allFieldsFilled) {
      Alert.alert('Error', 'Debe rellenar todos los campos')
      return
    }

    try {
      const fileUri = FileSystem.documentDirectory + 'formData.json'
      const dataToSave = { selectedOptions, selectedRadio, date, formData }
      console.log ("Datos guardados:", dataToSave)
      // Guardar datos como JSON
      // await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(dataToSave))

      console.log('Datos guardados en:', fileUri)
      Alert.alert('Éxito', 'Datos guardados correctamente')
    } catch (error) {
      console.error('Error al guardar los datos:', error)
      Alert.alert('Error', 'No se pudo guardar los datos')
    }
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      
      {/* ScrollView para que los campos sean desplazables */}
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>(Nombre Formulario)</Text>
        <View style={styles.container}>
          {/* ItemSelector con opciones */}
          <ItemSelector items={testItems} onSelect={handleSelect} />

          <Text category="h1" style={styles.title}>Select a Date</Text>

          {/* UI Kitten DatePicker */}
          <Datepicker
            date={date}
            onSelect={nextDate => setDate(nextDate)}
            style={styles.datePicker}
          />

          {/* Mostrar la fecha seleccionada */}
          <Text style={styles.selectedDate}>
            Selected Date: {date.toDateString()}
          </Text>

          {/* CheckboxGroup con opciones */}
          <CheckboxGroup items={testItems} onSelect={handleCheckboxSelect} />

          {/* Mostrar opciones seleccionadas de checkboxes */}
          <Text style={styles.selectedCheckboxes}>
            Selected Checkboxes: {selectedOptions.join(', ')}
          </Text>

          {/* RadioButtonGroup con opciones */}
          <RadioButtonGroup items={testItems} onSelect={handleRadioSelect} />

          {/* Mostrar opción seleccionada de radio buttons */}
          <Text style={styles.selectedRadio}>
            Selected Radio: {selectedRadio || 'Ninguno'} {/* Muestra 'Ninguno' si no hay selección */}
          </Text>

          {/* Botón para reiniciar la fecha */}
          <Button onPress={() => setDate(new Date())} style={styles.clearButton}>
            Reset to Today
          </Button> 

          {/* Componente CamposDB */}
          <EntradaTexto items={testFields} onSelect={handleChange} />
        </View>
      </ScrollView>

      {/* Botón fijo */}
      <View style={styles.fixedButton}>
        <Button title="Guardar" onPress={handleSubmit} />
      </View>
    </ApplicationProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  scrollContent: {
    paddingBottom: 100, // Espacio para que no tape el botón al final
  },
  title: {
    marginBottom: 20,
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
  },
  datePicker: {
    width: 300,
    marginBottom: 20
  },
  selectedDate: {
    marginVertical: 20,
    fontSize: 16
  },
  selectedCheckboxes: {
    marginVertical: 20,
    fontSize: 16
  },
  selectedRadio: {
    marginVertical: 20,
    fontSize: 16
  },
  clearButton: {
    marginTop: 20
  },
  fixedButton: {
    position: 'absolute',
    bottom: 20, // Posiciona el botón 20 píxeles desde abajo
    left: 100,
    right: 100,
  }
});
