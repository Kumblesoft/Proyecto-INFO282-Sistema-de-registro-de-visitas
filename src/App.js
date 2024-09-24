import React, { useState } from 'react'
import * as eva from '@eva-design/eva'
import { ApplicationProvider, Datepicker, Text, Button } from '@ui-kitten/components'
import { StyleSheet, View, ScrollView } from 'react-native'
import ItemSelector from "./components/ItemSelector"
import CheckboxGroup from "./components/CheckboxGroup"
import RadioButtonGroup from "./components/RadioButtonGroup"
import EntradaTexto from "./components/EntradaTexto"
import SaveButton from "./components/SaveButton"

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
  const [textData, setTextData] = useState(testFields)
  const [date, setDate] = useState(new Date())
  const [selectedOptions, setSelectedOptions] = useState([])
  const [selectedRadio, setSelectedRadio] = useState(null)

  // Callback para manejar cambios en los campos
  const handleChange = (name, value) => {
    setTextData({
      ...textData,
      [name]: value,
    })
  }

  // Usar SaveButton con su lógica de guardado
  const saveButtonRef = SaveButton({
    textData,
    selectedOptions,
    selectedRadio,
    date,
    onSave: (data) => {
      console.log("Datos guardados exitosamente:", data)
    }
  })

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      
      {/* ScrollView para que los campos sean desplazables */}
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>(Nombre Formulario)</Text>
        <View style={styles.container}>
          {/* ItemSelector con opciones */}
          <ItemSelector items={testItems} onSelect={value => console.log("Valor seleccionado:", value)} />

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
          <CheckboxGroup items={testItems} onSelect={setSelectedOptions} />

          {/* Mostrar opciones seleccionadas de checkboxes */}
          <Text style={styles.selectedCheckboxes}>
            Selected Checkboxes: {selectedOptions.join(', ')}
          </Text>

          {/* RadioButtonGroup con opciones */}
          <RadioButtonGroup items={testItems} onSelect={setSelectedRadio} />

          {/* Mostrar opción seleccionada de radio buttons */}
          <Text style={styles.selectedRadio}>
            Selected Radio: {selectedRadio || 'Ninguno'} {/* Muestra 'Ninguno' si no hay selección */}
          </Text>

          {/* Componente EntradaTexto */}
          <EntradaTexto items={testFields} onSelect={handleChange} />
        </View>
      </ScrollView>

      {/* Botón para guardar que llama al método handleSubmit de SaveButton */}
      <Button onPress={saveButtonRef.handleSubmit} style={styles.fixedButton}>
        Guardar
      </Button>
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
  fixedButton: {
    position: 'absolute',
    marginBottom:20,
    bottom: 20, // Posiciona el botón 20 píxeles desde abajo
    left: '50%', // Lo mueve al centro horizontal
    transform: [{ translateX: -50 }], // Ajusta el botón al centro
    width: 100, // Hace el botón más pequeño
  }

});
