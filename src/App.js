import React, { useState } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Datepicker, Button, Text, Modal, Card } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import ItemSelector from "./components/ItemSelector";
import CheckboxGroup from "./components/CheckboxGroup";
import RadioButtonGroup from "./components/RadioButtonGroup";
import HourSelector from "./components/HourSelector"; // Importamos el componente HourSelector

const testItems = [
  { value: 'option1', name: 'Opción 1' },
  { value: 'option2', name: 'Opción 2' },
  { value: 'option3', name: 'Opción 3' }
];

export default function App() {
  const [time, setTime] = useState("" + (new Date().getHours()).toString().padStart(2,"0") + ":" + (new Date().getMinutes()).toString().padStart(2,"0"));
  const [date, setDate] = useState(new Date());
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState(null);
  
  const handleSelect = (value) => {
    console.log("Valor seleccionado:", value);
  };

  const handleCheckboxSelect = (values) => {
    setSelectedOptions(values);
  };

  const handleRadioSelect = (value) => {
    setSelectedRadio(value);
  };

  const handleHourSelect = () => {
    setShowHourSelector(true); // Abre el modal
  };

  const closeHourSelector = () => {
    setShowHourSelector(false); // Cierra el modal
  };

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <View style={styles.container}>
        <ItemSelector items={testItems} onSelect={handleSelect} />
        <Text category="h1" style={styles.title}>Select a Date</Text>

        <Datepicker date={date} onSelect={nextDate => setDate(nextDate)} style={styles.datePicker} />

        <Text style={styles.selectedDate}>Selected Date: {date.toDateString()}</Text>

        <CheckboxGroup items={testItems} onSelect={handleCheckboxSelect} />

        <Text style={styles.selectedCheckboxes}>
          Selected Checkboxes: {selectedOptions.join(', ')}
        </Text>

        <RadioButtonGroup items={testItems} onSelect={handleRadioSelect} />

        <Text style={styles.selectedRadio}>
          Selected Radio: {selectedRadio || 'Ninguno'}
        </Text>

        <Button onPress={() => setDate(new Date())} style={styles.clearButton}>
          Reset to Today
        </Button>
        <HourSelector time={time} setTime={setTime} />

      </View>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    marginBottom: 20,
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
  clearButton: {
    marginTop: 20,
  },
});
