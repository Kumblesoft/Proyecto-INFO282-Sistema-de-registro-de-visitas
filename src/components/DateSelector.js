import React from 'react';
import { Datepicker, Layout, Text } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

const DateSelector = ({ date, onSelectDate }) => {
  return (
    <Layout style={styles.container}>
      <Text category="h6" style={styles.label}>
        Select Date
      </Text>

      <Datepicker
        date={date}
        onSelect={onSelectDate}
        style={styles.datePicker}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    marginBottom: 10,
  },
  datePicker: {
    width: 300,
  },
});

export default DateSelector;
