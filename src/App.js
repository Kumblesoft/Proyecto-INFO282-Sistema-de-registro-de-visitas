import React, { useState } from 'react'
import * as eva from '@eva-design/eva'
import { ApplicationProvider, Datepicker, Button, Text } from '@ui-kitten/components'
import { StyleSheet, View } from 'react-native'
import  ComponentTypes, { OptionSelector } from './components/selector/OptionSelector'

// Opciones para el select
const testItems = [
  { value: 'option1', name: 'Opción 1' },
  { value: 'option2', name: 'Opción 2' },
  { value: 'option3', name: 'Opción 3' }
]

export default function App() {
  // Estado para la fecha seleccionada
  const [date, setDate] = useState(new Date())
  const [selectedOptions, setSelectedOptions] = useState([])
  const [selectedRadio, setSelectedRadio] = useState(null)

  const handleOptionSelector = value => console.log(value)

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <View style={styles.container}>

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
        {/* Botón para reiniciar la fecha */}
        <Button onPress={() => setDate(new Date())} style={styles.clearButton}>
          Reset to Today
        </Button>

        <OptionSelector items={testItems} 
          type={ComponentTypes.SELECT}
          title="Selector Dopdown"
          defaultOption={"option1"}
          placeholder="seleccione"/>
          
        <OptionSelector items={testItems} 
          type={ComponentTypes.RADIO}
          title="Selector Radio"
          defaultOption={"option2"}
          placeholder="SISIASJLDASJKLD"/>
        
        <OptionSelector items={testItems} 
          type={ComponentTypes.CHECKBOX}
          title="Selector Checkbox"
          defaultOption={"option3"}
          placeholder="seleccione"/>


      </View>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  title: {
    marginBottom: 20
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
  }
});
