import React, { useState } from 'react'
import * as eva from '@eva-design/eva'
import { ApplicationProvider, Datepicker, Button, Text } from '@ui-kitten/components'
import { StyleSheet, View } from 'react-native'
import  OptionSelector, { OptionComponentType, OptionSelectorFeatures } from './components/selector/OptionSelector'
import DateSelector from './components/DateSelector'

// Opciones para el select
const testItems = [
  { value: 'option1', name: 'Opción 1' },
  { value: 'option2', name: 'Opción 2' },
  { value: 'option3', name: 'Opción 3' }
]

export default function App() {
  // Estado para la fecha seleccionada
  const [date, setDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
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
