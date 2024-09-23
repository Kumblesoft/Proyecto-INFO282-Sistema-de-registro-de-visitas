import React, { useState } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Datepicker, Button, Text } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import ItemSelector from "./components/ItemSelector"; // Importa el componente ItemSelector
import CheckboxGroup from "./components/CheckboxGroup"; // Importa el componente CheckboxGroup
import RadioButtonGroup from "./components/RadioButtonGroup"; // Importa el nuevo componente RadioButtonGroup

// Opciones para el select
const optionsSelect = [
  { value: 'option1', name: 'Opción 1' },
  { value: 'option2', name: 'Opción 2' },
  { value: 'option3', name: 'Opción 3' },
];

// Opciones para los checkboxes
const optionsCheckbox = [
  { value: 'checkbox1', name: 'Checkbox 1' },
  { value: 'checkbox2', name: 'Checkbox 2' },
  { value: 'checkbox3', name: 'Checkbox 3' },
];

// Opciones para los radio buttons
const optionsRadio = [
  { value: 'radio1', name: 'Radio 1' },
  { value: 'radio2', name: 'Radio 2' },
  { value: 'radio3', name: 'Radio 3' },
];

export default function App() {
  // Estado para la fecha seleccionada
  const [date, setDate] = useState(new Date());
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState(null);

  // Callback para cuando se seleccione una opción en el select
  const handleSelect = item => {
    console.log("Valor seleccionado:", item.value);
  };

  // Callback para cuando se seleccionen opciones en los checkboxes
  const handleCheckboxSelect = (values) => {
    console.log("Valores seleccionados en checkboxes:", values);
    setSelectedOptions(values); // Actualiza el estado con los valores seleccionados
  };

  // Callback para cuando se seleccione una opción en los radio buttons
  const handleRadioSelect = (value) => {
    console.log("Valor seleccionado en radio buttons:", value);
    setSelectedRadio(value); // Actualiza el estado con el valor seleccionado
  };

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <View style={styles.container}>
        {/* ItemSelector con opciones */}
        <ItemSelector items={optionsSelect} onSelect={handleSelect} />

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
        <CheckboxGroup items={optionsCheckbox} onSelect={handleCheckboxSelect} />

        {/* Mostrar opciones seleccionadas de checkboxes */}
        <Text style={styles.selectedCheckboxes}>
          Selected Checkboxes: {selectedOptions.join(', ')}
        </Text>

        {/* RadioButtonGroup con opciones */}
        <RadioButtonGroup items={optionsRadio} onSelect={handleRadioSelect} />

        {/* Mostrar opción seleccionada de radio buttons */}
        <Text style={styles.selectedRadio}>
          Selected Radio: {selectedRadio || 'Ninguno'} {/* Muestra 'Ninguno' si no hay selección */}
        </Text>

        {/* Botón para reiniciar la fecha */}
        <Button onPress={() => setDate(new Date())} style={styles.clearButton}>
          Reset to Today
        </Button>
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
