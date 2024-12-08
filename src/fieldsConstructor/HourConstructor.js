import React, { useState } from 'react'
import { View, Text, TextInput, Button, Switch, StyleSheet, Alert } from 'react-native'

const HourConstructor = ({ field = {}, onSave }) => {
    const [fieldName, setFieldName] = useState(field.nombre || '')
    const [defaultHour, setDefaultHour] = useState(field.hora_predeterminada || '')
    const [isEditable, setIsEditable] = useState(field.isEditable || false) // Valor predeterminado corregido

    const handleSave = () => {
        // Validar valores antes de guardar
        if (!fieldName.trim()) {
            Alert.alert("Error", "El nombre del campo no puede estar vacío.")
            return
        }

        if (defaultHour !== "actual" && !/^\d{2}:\d{2}$/.test(defaultHour)) {
            Alert.alert(
                "Error",
                "La hora predeterminada debe ser 'actual' o estar en formato hh:mm."
            )
            return
        }

        const field = {
            nombre: fieldName,
            "hora predeterminada": defaultHour,
            salida: fieldName.toLowerCase().replace(/ /g, '_'),
            limitaciones: {
                tipo: "ArregloFecha",
                compatibilidadLimitaciones: [
                    [1, 0],
                    [0, 1]
                ],
                enumLimitaciones: isEditable ? "editable" : "no editable"
            } 
        }

        if (onSave) {
            console.log(field)
            onSave(field)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configurar Campo de Hora</Text>

            {/* Nombre del Campo */}
            <View style={styles.field}>
                <Text style={styles.label}>Nombre del Campo</Text>
                <TextInput
                    value={fieldName}
                    onChangeText={setFieldName}
                    placeholder="Nombre del campo"
                    style={styles.input}
                />
            </View>

            {/* Hora Predeterminada */}
            <View style={styles.field}>
                <Text style={styles.label}>Hora Predeterminada</Text>
                <TextInput
                    value={defaultHour}
                    onChangeText={setDefaultHour}
                    placeholder="actual o formato hh:mm"
                    style={styles.input}
                />
            </View>

            {/* Editable */}
            <View style={styles.field}>
                <Text style={styles.label}>¿Editable?</Text>
                <Switch
                    value={isEditable}
                    onValueChange={setIsEditable}
                />
            </View>

            {/* Botón Guardar */}
            <View style={styles.saveButtonContainer}>
                <Button title="Guardar Campo" onPress={handleSave} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    field: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 4,
        padding: 8,
        fontSize: 16,
    },
    saveButtonContainer: {
        marginTop: 24,
        alignSelf: 'center',
    },
})

export default HourConstructor
