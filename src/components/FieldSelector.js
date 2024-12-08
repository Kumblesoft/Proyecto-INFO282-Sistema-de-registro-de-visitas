import React, { useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import {Text, Select, SelectItem, Button} from '@ui-kitten/components'
import fields from '../fieldsConstructor/fields' // Ajusta la ruta correctamente
import SelectorConstructor from '../fieldsConstructor/SelectorConstructor'
import RadioSelectorConstructor from '../fieldsConstructor/RadioConstructor'
import TextoConstructor from '../fieldsConstructor/TextConstructor'
import HourConstructor from '../fieldsConstructor/HourConstructor'
import DateConstructor from '../fieldsConstructor/DateConstructor'
import CheckBoxConstructor from '../fieldsConstructor/CheckBoxConstructor'
import CameraConstructor from '../fieldsConstructor/CameraConstructor'

const FieldSelector = () => {
    const [selectedField, setSelectedField] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [fieldsToDisplay, setFieldsToDisplay] = useState([]) // Almacena los campos agregados

    // Obtiene los tipos de campos del JSON (keys del objeto)
    const fieldTypes = Object.keys(fields)

    // Agregar un nuevo campo
    const handleNavigation = () => {
        if (fields[selectedField]) {
            setFieldsToDisplay([...fieldsToDisplay, { ...fields[selectedField], tipo: selectedField }])
        } else {
            console.log('Tipo de campo no implementado:', selectedField)
        }
    }

    // Eliminar un campo específico con confirmación
    const handleDeleteField = (indexToDelete) => {
        const fieldName = fieldsToDisplay[indexToDelete]?.nombre || fieldsToDisplay[indexToDelete]?.tipo || "este campo"
    
        Alert.alert(
            'Confirmación de Eliminación', // Título del mensaje
            `¿Estás seguro de que quieres eliminar el campo "${fieldName}"?`, // Mensaje con el nombre del campo
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    onPress: () => {
                        setFieldsToDisplay(fieldsToDisplay.filter((_, index) => index !== indexToDelete))
                    },
                    style: 'destructive', // Estilo rojo en iOS
                },
            ],
            { cancelable: true } // Permite cerrar el diálogo tocando fuera de él
        )
    }
    
    return (
        <View style={styles.container}>
        {/* Mostrar los campos agregados */}
        {fieldsToDisplay.map((field, index) => (
            <View key={index} style={styles.fieldContainer}>
                {/* Mostrar el campo según su tipo */}
                {field.tipo === 'radio' && (
                    <RadioSelectorConstructor field={field} onSave={() => {}} />
                )}
                {field.tipo === 'texto' && (
                    <TextoConstructor field={field} onSave={() => {}} />
                )}
                {field.tipo === 'selector' && (
                    <SelectorConstructor field={field} onSave={() => {}} />
                )}
                {field.tipo === 'hora' && (
                    <HourConstructor field={field} onSave={() => {}} />
                )}
                {field.tipo === 'fecha' && (
                    <DateConstructor field={field} onSave={() => {}} />
                )}
                {field.tipo === 'checkbox' && (
                    <CheckBoxConstructor field={field} onSave={() => {}} />
                )}
                {field.tipo === 'camara' && (
                    <CameraConstructor field={field} onSave={() => {}} />
                )}
                {!['radio', 'texto', 'selector', 'hora', 'fecha', 'checkbox', 'camara'].includes(field.tipo) && (
                    <Text>Campo no reconocido</Text>
                )}
    
                {/* Botón para eliminar este campo */}
                <Button
                    title="Eliminar Campo"
                    status="danger"
                    onPress={() => handleDeleteField(index)}
                >
                    Eliminar Campo
                </Button>
            </View>
        ))}
    
        {/* Sección destacada */}
        <View style={styles.selectionContainer}>
            <Text style={styles.selectionTitle}>Selecciona el tipo de campo</Text>
            <Select
                selectedIndex={selectedIndex}
                value={selectedField}
                onSelect={(itemValue) => {
                    setSelectedIndex(itemValue)
                    setSelectedField(fieldTypes[itemValue - 1])
                }}
                placeholder="Seleccione un tipo de campo"
            >
                {fieldTypes.map((fieldType) => (
                    <SelectItem title={fieldType} key={fieldType} />
                ))}
            </Select>
    
            <Button
                title="Agregar nuevo campo"
                onPress={handleNavigation}
                disabled={!selectedIndex}
                style={styles.addButton}
            >
                Agregar nuevo campo
            </Button>
        </View>
    </View>
    
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5'
    },
    fieldContainer: {
        marginBottom: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff'
    },
    selectionContainer: {
        marginTop: 20,
        padding: 16,
        borderWidth: 2,
        borderColor: '#6200ea',
        borderRadius: 12,
        backgroundColor: '#e8eaf6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5
    },
    selectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6200ea',
        marginBottom: 12,
        textAlign: 'center'
    },
    addButton: {
        marginTop: 16,
        backgroundColor: '#6200ea',
        borderRadius: 8,
        paddingVertical: 10
    }
})


export default FieldSelector
