import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Datepicker } from '@ui-kitten/components';
import { format } from 'date-fns';

export const OptionDateFeatures = options => {
  return {
    title: options.title,
    defaultDate: options.defaultOption ? "hoy" : new Date(),
    dateFormat: options.dateFormat,
    disabled: options.disabled,
    required: options.required ?? false, // Usa false como valor por defecto
  }
}

const DateSelector = ({ onChange, optionalFeatures}) => {
  optionalFeatures ??= {}
  const { title, defaultDate, dateFormat, required, disabled } = optionalFeatures
  const [selectedDate, setSelectedDate] = useState(defaultDate ? new Date() : null);

  const handleDateChange = (nextDate) => {
    setSelectedDate(nextDate);
    const formattedDate = nextDate ? format(nextDate, dateFormat) : "";
    onChange(formattedDate);
  };

  return (
    <View style={{ marginVertical: 10 }}>
      {!title ? <></> : 
          <Text category="h6" >{ 
              title +
              (required ? "*" : "")}
          </Text>
      }
      <Datepicker
        date={selectedDate}
        onSelect={handleDateChange}
        disabled={disabled}
      />
    </View>
  );
};

export default DateSelector;

