import React, { useState } from 'react'
import { View, Text, Button, StyleSheet, Alert } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import fields from '../fieldsConstructor/fields' // Ajusta la ruta correctamente
import SelectorConstructor from '../fieldsConstructor/SelectorConstructor'
import RadioSelectorConstructor from '../fieldsConstructor/RadioConstructor'
import TextoConstructor from '../fieldsConstructor/TextConstructor'
import HourConstructor from '../fieldsConstructor/HourConstructor'
import DateConstructor from '../fieldsConstructor/DateConstructor'
import CheckBoxConstructor from '../fieldsConstructor/CheckBoxConstructor'
import CameraConstructor from '../fieldsConstructor/CameraConstructor'

const FieldSelectorScreen = ({ navigation }) => {
    const [selectedField, setSelectedField] = useState('')
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
            <Text style={styles.title}>Selecciona el tipo de campo</Text>
            <Picker
                selectedValue={selectedField}
                onValueChange={(itemValue) => setSelectedField(itemValue)}
            >
                <Picker.Item label="Seleccione un tipo de campo" value="" />
                {fieldTypes.map((fieldType) => (
                    <Picker.Item key={fieldType} label={fieldType} value={fieldType} />
                ))}
            </Picker>

            <Button
                title="Agregar nuevo campo"
                onPress={handleNavigation}
                disabled={!selectedField}
            />

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
                        color="red"
                        onPress={() => handleDeleteField(index)}
                    />
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 18,
        marginBottom: 8,
    },
    fieldContainer: {
        marginTop: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 8,
    },
})

export default FieldSelectorScreen
