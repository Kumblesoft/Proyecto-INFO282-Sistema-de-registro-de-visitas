import React, { useState } from 'react'
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import {Text, Select, SelectItem, Button} from '@ui-kitten/components'
import fields from '../fieldsConstructor/fields' // Ajusta la ruta correctamente
import SelectorConstructor from '../fieldsConstructor/SelectorConstructor'
import RadioSelectorConstructor from '../fieldsConstructor/RadioConstructor'
import TextoConstructor from '../fieldsConstructor/TextConstructor'
import HourConstructor from '../fieldsConstructor/HourConstructor'
import DateConstructor from '../fieldsConstructor/DateConstructor'
import CheckBoxConstructor from '../fieldsConstructor/CheckBoxConstructor'
import CameraConstructor from '../fieldsConstructor/CameraConstructor'
import DragList from 'react-native-draglist'




const FieldSelector = () => {
    const [selectedField, setSelectedField] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [fieldsToDisplay, setFieldsToDisplay] = useState([]) // Almacena los campos agregados
    const [form, setForm] = useState({})

    // Obtiene los tipos de campos del JSON (keys del objeto)
    const fieldTypes = Object.keys(fields)

    function keyExtractor(str, _index) {
        return str;
    }

    const handleFieldSave = (field) => {
        fieldsToDisplay[fieldsToDisplay.indexOf(field)] = field
    }

    function renderItem(info) {
        const {item, onDragStart, onDragEnd, isActive} = info;
        const field = item;
        console.log(field)
        return (
        <TouchableOpacity 
            key={item.tipo}
            onPressIn={onDragStart} 
            onPressOut={onDragEnd}>
            <View style={styles.fieldContainer}>
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
                <Button
                    title="Eliminar Campo"
                    status="danger"
                    onPress={() => handleDeleteField(fieldsToDisplay.indexOf(item))}
                >
                    Eliminar Campo
                </Button>
            </View>
        </TouchableOpacity>
        )
    }

    async function onReordered(fromIndex, toIndex) {
        const copy = [...fieldsToDisplay]; // Don't modify react data in-place
        const removed = copy.splice(fromIndex, 1);

        copy.splice(toIndex, 0, removed[0]); // Now insert at the new pos
        setFieldsToDisplay(copy);
    }

    // Agregar un nuevo campo
    const handleNewField = () => {
        if (fields[selectedField]) {
            fieldsToDisplay.push({ ...fields[selectedField], tipo: selectedField })
            setFieldsToDisplay([...fieldsToDisplay])
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

    const handleSave = () => {
        setForm(fieldsToDisplay)
        console.log(form)
    }
    
    return (
        <View style={styles.container}>
        <DragList
            data={fieldsToDisplay}
            keyExtractor={keyExtractor}
            onReordered={onReordered}
            renderItem={renderItem} 
        />
        
    
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
                onPress={handleNewField}
                disabled={!selectedIndex}
                style={styles.addButton}
            >
                Agregar nuevo campo
            </Button>
        </View>
        <Button title="Guardar Cambios" onPress={handleSave} > Guardar Cambios </Button>
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
