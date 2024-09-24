import React, { useState } from 'react'
import * as eva from '@eva-design/eva'
import { ApplicationProvider, Datepicker, Text, Button } from '@ui-kitten/components'
import { StyleSheet, View, ScrollView } from 'react-native'
import EntradaTexto from "./components/EntradaTexto"
import SaveButton from "./components/SaveButton"
import  OptionSelector, { OptionComponentType, OptionSelectorFeatures } from './components/selector/OptionSelector'
import DateSelector from './components/DateSelector'
import HourSelector from "./components/HourSelector"; // Importamos el componente HourSelector

const testItems = [
  { value: 'option1', name: 'Opción 1' },
  { value: 'option2', name: 'Opción 2' },
  { value: 'option3', name: 'Opción 3' }
];

// Campos del formulario
const testFields = {
  nombre: '',
  email: '',
  telefono: '',
}

export default function App() {
  const [time, setTime] = useState("" + (new Date().getHours()).toString().padStart(2,"0") + ":" + (new Date().getMinutes()).toString().padStart(2,"0"));
  // Estado para los datos del formulario
  const [textData, setTextData] = useState(testFields)
  const [date, setDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
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

          <Text category="h1" style={styles.title}>Select a Date</Text>

        {/* UI Kitten DatePicker */}
        <DateSelector
          date={selectedDate}
          onSelectDate={nextDate => setSelectedDate(nextDate)}
        />

        {/* Mostrar la fecha seleccionada */}
        <Text style={styles.selectedDate}>
          Selected Date: {selectedDate.toDateString()}
        </Text>
        {/* Botón para reiniciar la fecha */}
        <Button onPress={() => setDate(new Date())} style={styles.clearButton}>
          Reset to Today
        </Button>

        
        <OptionSelector items={testItems} 
          type={OptionComponentType.DROPDOWN}
        />
          
        <OptionSelector items={testItems} 
          type={OptionComponentType.RADIO}
          optionalFeatures={
            OptionSelectorFeatures({title:"Selector Radio"})}
        />
        
        <OptionSelector items={testItems} 
          type={OptionComponentType.CHECKBOX}
          optionalFeatures={
            OptionSelectorFeatures({
              title:"Checkbox group",
              defaultOption:"option3",
              maxChecked:1,
              required:true})}
        />
      {/* Componente EntradaTexto */}
      <EntradaTexto items={testFields} onSelect={handleChange} />
      {/*Componente selector de hora */}
      <HourSelector time={time} setTime={setTime} />
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
    padding: 16,
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
    marginBottom: 20,
  },
  selectedDate: {
    marginVertical: 20,
    fontSize: 16,
  },
  selectedCheckboxes: {
    marginVertical: 20,
    fontSize: 16,
  },
  selectedRadio: {
    marginVertical: 20,
    fontSize: 16,
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
