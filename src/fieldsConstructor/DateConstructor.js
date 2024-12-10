import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import { Text, Input, Button, Toggle, Datepicker, NativeDateService } from '@ui-kitten/components'	

const DateConstructor = ({ field = {}, onSave }) => {
    const [fieldName, setFieldName] = useState(field.name || "")
    const [defaultDate, setDefaultDate] = useState(field.defaultDate || "")
    const [date, setDate] = useState(new Date())
    const [isEditable, setIsEditable] = useState(field.isEditable || false)
    const [dateFormat, setDateFormat] = useState("DD/MM/YYYY") // Formato por defecto

    // Obtiene la fecha actual en el formato solicitado
    const formatCurrentDate = (format) => {
        const today = new Date()
        const day = String(today.getDate()).padStart(2, "0")
        const month = String(today.getMonth() + 1).padStart(2, "0")
        const year = today.getFullYear()

        switch (format) {
            case "DD/MM/YYYY":
                return `${day}/${month}/${year}`
            case "MM/DD/YYYY":
                return `${month}/${day}/${year}`
            case "YYYY/MM/DD":
                return `${year}/${month}/${day}`
            case "YYYY/DD/MM":
                return `${year}/${day}/${month}`
            case "MM/YYYY/DD":
                return `${month}/${year}/${day}`
            case "DD/YYYY/MM":
                return `${day}/${year}/${month}`
            default:
                return `${day}/${month}/${year}`
        }
    }

    // Actualiza la fecha predeterminada cada vez que cambia el formato
    useEffect(() => {
        setDefaultDate(formatCurrentDate(dateFormat))
    }, [dateFormat])

    const configureDDateService = new NativeDateService('en', {
        startDayOfWeek:1,
        format: dateFormat
    })

    const handleSave = () => {
        if (!fieldName.trim()) {
            Alert.alert("Error", "El nombre del campo no puede estar vacío.")
            return
        }

        const formatPatterns = {
            "DD/MM/YYYY": /^\d{2}\/\d{2}\/\d{4}$/,
            "MM/DD/YYYY": /^\d{2}\/\d{2}\/\d{4}$/,
            "YYYY/MM/DD": /^\d{4}\/\d{2}\/\d{2}$/,
            "YYYY/DD/MM": /^\d{4}\/\d{2}\/\d{2}$/,
            "MM/YYYY/DD": /^\d{2}\/\d{4}\/\d{2}$/,
            "DD/YYYY/MM": /^\d{2}\/\d{4}\/\d{2}$/
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
                <Input
                    value={fieldName}
                    onChange={setFieldName}
                    placeholder="Nombre del campo"
                    style={styles.input}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Formato de Fecha</Text>
                <View style={styles.buttonGroup}>
                    {[
                        "DD/MM/YYYY",
                        "MM/DD/YYYY",
                        "YYYY/MM/DD",
                        "YYYY/DD/MM",
                        "MM/YYYY/DD",
                        "DD/YYYY/MM"
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

            <Datepicker
                date={date}
                onSelect={nextDate => {
                    setDate(nextDate);
                }}
                placeholder={dateFormat}
                min={new Date(1900, 0, 1)}
                max={new Date(2100, 11, 31)}
                dateService={configureDDateService}
            />

            <View style={styles.field}>
                <Text style={styles.label}>¿Editable?</Text>
                <Toggle
                    checked={isEditable}
                    onChange={setIsEditable}
                />
            </View>

            <View style={styles.saveButtonContainer}>
                <Button title="Guardar Campo" onPress={handleSave} >Guardar Campo</Button>
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
        paDDing: 8,
        borderRadius: 4,
    },
    buttonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    formatButton: {
        paDDing: 8,
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
