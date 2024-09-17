import React, { useState } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Datepicker, Button, Text } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

export default function App() {
  // State for the selected date
  const [date, setDate] = useState(new Date());

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layout style={styles.container}>
        <Text category="h1" style={styles.title}>Select a Date</Text>

        {/* UI Kitten DatePicker */}
        <Datepicker
          date={date}
          onSelect={nextDate => setDate(nextDate)}
          style={styles.datePicker}
        />

        {/* Display the selected date */}
        <Text style={styles.selectedDate}>
          Selected Date: {date.toDateString()}
        </Text>

        {/* Clear the selected date */}
        <Button onPress={() => setDate(new Date())} style={styles.clearButton}>
          Reset to Today
        </Button>
      </Layout>
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
  clearButton: {
    marginTop: 20,
  },
});
