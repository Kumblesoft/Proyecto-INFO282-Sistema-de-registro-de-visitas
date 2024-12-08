import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Button, Switch, StyleSheet, Alert, TouchableOpacity } from 'react-native'

const DateConstructor = ({ field = {}, onSave }) => {
    const [fieldName, setFieldName] = useState(field.name || "")
    const [defaultDate, setDefaultDate] = useState(field.defaultDate || "")
    const [isEditable, setIsEditable] = useState(field.isEditable || false)
    const [dateFormat, setDateFormat] = useState("dd/mm/yyyy") // Formato por defecto

    // Obtiene la fecha actual en el formato solicitado
    const formatCurrentDate = (format) => {
        const today = new Date()
        const day = String(today.getDate()).padStart(2, "0")
        const month = String(today.getMonth() + 1).padStart(2, "0")
        const year = today.getFullYear()

        switch (format) {
            case "dd/mm/yyyy":
                return `${day}/${month}/${year}`
            case "mm/dd/yyyy":
                return `${month}/${day}/${year}`
            case "yyyy/mm/dd":
                return `${year}/${month}/${day}`
            case "yyyy/dd/mm":
                return `${year}/${day}/${month}`
            case "mm/yyyy/dd":
                return `${month}/${year}/${day}`
            case "dd/yyyy/mm":
                return `${day}/${year}/${month}`
            default:
                return `${day}/${month}/${year}`
        }
    }

    // Actualiza la fecha predeterminada cada vez que cambia el formato
    useEffect(() => {
        setDefaultDate(formatCurrentDate(dateFormat))
    }, [dateFormat])

    const handleDateInput = (text, format) => {
        const formatPatterns = {
            "dd/mm/yyyy": /^\d{2}\/\d{2}\/\d{4}$/,
            "mm/dd/yyyy": /^\d{2}\/\d{2}\/\d{4}$/,
            "yyyy/mm/dd": /^\d{4}\/\d{2}\/\d{2}$/,
            "yyyy/dd/mm": /^\d{4}\/\d{2}\/\d{2}$/,
            "mm/yyyy/dd": /^\d{2}\/\d{4}\/\d{2}$/,
            "dd/yyyy/mm": /^\d{2}\/\d{4}\/\d{2}$/
        }

        const isValid = formatPatterns[format]?.test(text)

        if (isValid) {
            setDefaultDate(text)
        } else {
            Alert.alert("Error", `La fecha debe coincidir con el formato ${format}.`)
        }
    }

    const handleSave = () => {
        if (!fieldName.trim()) {
            Alert.alert("Error", "El nombre del campo no puede estar vacío.")
            return
        }

        const formatPatterns = {
            "dd/mm/yyyy": /^\d{2}\/\d{2}\/\d{4}$/,
            "mm/dd/yyyy": /^\d{2}\/\d{2}\/\d{4}$/,
            "yyyy/mm/dd": /^\d{4}\/\d{2}\/\d{2}$/,
            "yyyy/dd/mm": /^\d{4}\/\d{2}\/\d{2}$/,
            "mm/yyyy/dd": /^\d{2}\/\d{4}\/\d{2}$/,
            "dd/yyyy/mm": /^\d{2}\/\d{4}\/\d{2}$/
        }

        const isValid = formatPatterns[dateFormat]?.test(defaultDate)

        if (!isValid) {
            Alert.alert(
                "Error",
                `La fecha predeterminada debe coincidir con el formato ${dateFormat}.`
            )
            return
        }

        const field = {
            nombre: fieldName,
            salida: fieldName.toLowerCase().replace(/ /g, "_"),
            limitaciones: {
                tipo: "ArregloFecha",
                compatibilidadLimitaciones: [
                    [1, 0],
                    [0, 1]
                ],
                enumLimitaciones: isEditable ? "editable" : "no editable"
            },
            formato: {
                tipo: "ArregloFecha",
                enumFormato: dateFormat
            },
            "fecha predeterminada": defaultDate
        }

        if (onSave) {
            console.log(field)
            onSave(field)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configurar Campo de Fecha</Text>

            <View style={styles.field}>
                <Text style={styles.label}>Nombre del Campo</Text>
                <TextInput
                    value={fieldName}
                    onChangeText={setFieldName}
                    placeholder="Nombre del campo"
                    style={styles.input}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Formato de Fecha</Text>
                <View style={styles.buttonGroup}>
                    {[
                        "dd/mm/yyyy",
                        "mm/dd/yyyy",
                        "yyyy/mm/dd",
                        "yyyy/dd/mm",
                        "mm/yyyy/dd",
                        "dd/yyyy/mm"
                    ].map((format) => (
                        <TouchableOpacity
                            key={format}
                            style={[
                                styles.formatButton,
                                dateFormat === format && styles.selectedFormatButton
                            ]}
                            onPress={() => setDateFormat(format)}
                        >
                            <Text
                                style={[
                                    styles.formatText,
                                    dateFormat === format && styles.selectedFormatText
                                ]}
                            >
                                {format}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TextInput
                value={defaultDate}
                onChangeText={setDefaultDate}
                onEndEditing={() => handleDateInput(defaultDate, dateFormat)}
                placeholder={dateFormat}
                style={styles.input}
            />

            <View style={styles.field}>
                <Text style={styles.label}>¿Editable?</Text>
                <Switch
                    value={isEditable}
                    onValueChange={setIsEditable}
                />
            </View>

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
        marginBottom: 16,
        fontWeight: 'bold',
        fontSize: 18,
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
        padding: 8,
        borderRadius: 4,
    },
    buttonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    formatButton: {
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#cccccc',
        marginBottom: 8,
        backgroundColor: '#f9f9f9',
        width: '30%',
        alignItems: 'center',
    },
    selectedFormatButton: {
        backgroundColor: '#007BFF',
        borderColor: '#007BFF',
    },
    formatText: {
        fontSize: 12,
        color: '#333',
    },
    selectedFormatText: {
        color: '#fff',
    },
    saveButtonContainer: {
        marginTop: 16,
        alignSelf: 'center',
    },
})

export default DateConstructor
