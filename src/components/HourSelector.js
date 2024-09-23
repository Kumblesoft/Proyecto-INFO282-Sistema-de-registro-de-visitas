import React, { useState } from 'react';
import { Button, Text, Layout } from '@ui-kitten/components';
import { StyleSheet, ScrollView, View } from 'react-native';

const hours = Array.from({ length: 12 }, (_, i) => i + 1); // Generar horas de 1 a 12
const minutes = Array.from({ length: 60 }, (_, i) => i); // Generar minutos de 0 a 59

export default function HourSelector({ onClose }) {
    const [selectedTime, setSelectedTime] = useState({ hour: 1, minute: 0, period: 'AM' });

    return (
        <Layout style={styles.container}>
        <Text category="h1">Selecciona una hora</Text>

        <View style={styles.pickerContainer}>
            {/* Selector de horas */}
            <ScrollView showsVerticalScrollIndicator={false} height={150} width={50}>
            {hours.map(hour => (
                <Text
                key={hour}
                style={[
                    styles.timeText,
                    selectedTime.hour === hour ? styles.selectedText : null,
                ]}
                onPress={() => setSelectedTime(prev => ({ ...prev, hour }))}
                >
                {hour}
                </Text>
            ))}
            </ScrollView>

            {/* Selector de minutos */}
            <ScrollView showsVerticalScrollIndicator={false} height={150} width={50}>
            {minutes.map(minute => (
                <Text
                key={minute}
                style={[
                    styles.timeText,
                    selectedTime.minute === minute ? styles.selectedText : null,
                ]}
                onPress={() => setSelectedTime(prev => ({ ...prev, minute }))}
                >
                {minute < 10 ? `0${minute}` : minute}
                </Text>
            ))}
            </ScrollView>

            {/* Selector de AM/PM */}
            <View style={styles.periodContainer}>
            {['AM', 'PM'].map(period => (
                <Text
                key={period}
                style={[
                    styles.timeText,
                    selectedTime.period === period ? styles.selectedText : null,
                ]}
                onPress={() => setSelectedTime(prev => ({ ...prev, period }))}
                >
                {period}
                </Text>
            ))}
            </View>
        </View>

        <Text category="h6" style={styles.selectedTime}>
            Hora seleccionada: {selectedTime.hour}:{selectedTime.minute < 10 ? `0${selectedTime.minute}` : selectedTime.minute} {selectedTime.period}
        </Text>

        <Button style={styles.closeButton} onPress={onClose}>
            Cerrar
        </Button>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    pickerContainer: {
        flexDirection: 'row',
        marginVertical: 20,
    },
    timeText: {
        fontSize: 20,
        paddingVertical: 10,
        marginHorizontal: 5,
    },
    selectedText: {
        fontWeight: 'bold',
        fontSize: 24,
        color: '#3366FF', // Color para el texto seleccionado
    },
    periodContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    selectedTime: {
        marginVertical: 20,
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
    },
});
