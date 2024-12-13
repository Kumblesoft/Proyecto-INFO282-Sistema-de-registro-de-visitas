import React, { useState, useEffect } from 'react' 
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import { Text, Select, SelectItem, Button } from '@ui-kitten/components'

import fields from '../fieldsConstructor/fields' // Ajusta la ruta correctamente
import SelectorConstructor from '../fieldsConstructor/SelectorConstructor'
import RadioSelectorConstructor from '../fieldsConstructor/RadioConstructor'
import TextoConstructor from '../fieldsConstructor/TextConstructor'
import HourConstructor from '../fieldsConstructor/HourConstructor'
import DateConstructor from '../fieldsConstructor/DateConstructor'
import CheckBoxConstructor from '../fieldsConstructor/CheckBoxConstructor'
import CameraConstructor from '../fieldsConstructor/CameraConstructor'
import DragList from 'react-native-draglist'

const constructors = new Map([
    ['radio', RadioSelectorConstructor],
    ['texto', TextoConstructor],
    ['selector', SelectorConstructor],
    ['hora', HourConstructor],
    ['fecha', DateConstructor],
    ['checkbox', CheckBoxConstructor],
    ['camara', CameraConstructor]
])
let fieldNames = new Set()

const FieldSelector = ({ onSave, form }) => {
    const [selectedField, setSelectedField] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [fieldsToDisplay, setFieldsToDisplay] = useState([]) // Almacena los campos agregados
    const [miniFields, setMiniFields] = useState([]) // Almacena los nombres de los campos
    const [dragMode, setDragMode] = useState(false)

    // Inicializar los campos del formulario recibido
    useEffect(() => {
        if (form?.campos) {
            setFieldsToDisplay(form.campos)
            setMiniFields(form.campos.map((field) => field.nombre || ''))
            fieldNames = new Set(form.campos.map((field) => field.nombre || ''))
        }
    }, [form])

    const handleFieldSave = (field, index) => {
        if (fieldNames.has(field.nombre) && field.nombre !== miniFields[index]) {
            Alert.alert('Error', `El campo "${field.nombre}" ya existe en el formulario`)
            return
        }
        fieldsToDisplay[index] = field
        fieldNames.delete(miniFields[index])
        miniFields[index] = field.nombre
        fieldNames.add(field.nombre)
    }

    const handleNewField = () => {
        if (fields[selectedField]) {
            const copy = [...fieldsToDisplay]
            copy.push({ ...fields[selectedField], tipo: selectedField })

            const miniCopy = [...miniFields]
            miniCopy.push(fields[selectedField].nombre)
            setFieldsToDisplay(copy)
            setMiniFields(miniCopy)
        } else {
            Alert.alert('Error', 'Tipo de campo no implementado')
        }
    }

    const handleDeleteField = (indexToDelete) => {
        const fieldName = fieldsToDisplay[indexToDelete]?.nombre || "este campo"
    
        Alert.alert(
            'Confirmación de Eliminación',
            `¿Estás seguro de que quieres eliminar el campo "${fieldName}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    onPress: () => {
                        setFieldsToDisplay(fieldsToDisplay.filter((_, index) => index !== indexToDelete))
                        setMiniFields(miniFields.filter((_, index) => index !== indexToDelete))
                        fieldNames.delete(fieldName)
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        )
    }

    const handleSave = () => {
        console.log(fieldsToDisplay)
        onSave(fieldsToDisplay)
    }

    const handleDragMode = () => {
        if (miniFields.some((field) => field === '') || miniFields.length === 0) {
            Alert.alert('Error', 'Los campos deben tener nombre')
        } else {
            setDragMode(!dragMode)
        }
    }

    return (
        <View style={styles.container}>
            <Button onPress={() => handleDragMode()}>{dragMode ? "Guardar Orden" : "Editar Orden"}</Button>
            {dragMode ? (
                <View style={styles.fieldContainer}>
                    <DragList
                        data={miniFields}
                        keyExtractor={(str) => str}
                        onReordered={(fromIndex, toIndex) => {
                            const reorderedFields = [...fieldsToDisplay]
                            const [removed] = reorderedFields.splice(fromIndex, 1)
                            reorderedFields.splice(toIndex, 0, removed)
                            setFieldsToDisplay(reorderedFields)

                            const reorderedMini = [...miniFields]
                            const [removedMini] = reorderedMini.splice(fromIndex, 1)
                            reorderedMini.splice(toIndex, 0, removedMini)
                            setMiniFields(reorderedMini)
                        }}
                        renderItem={({ item, onDragStart, onDragEnd }) => (
                            <TouchableOpacity
                                onPressIn={onDragStart}
                                onPressOut={onDragEnd}
                                style={styles.containerBox}>
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            ) : (
                fieldsToDisplay.map((item, index) => {
                    const FieldComponent = constructors.get(item.tipo)
                    return (
                        <View key={index} style={styles.fieldContainer}>
                            <FieldComponent field={item} onSave={(field) => handleFieldSave(field, index)} />
                            <Button
                                title="Eliminar Campo"
                                status="danger"
                                onPress={() => handleDeleteField(index)}
                            >
                                Eliminar Campo
                            </Button>
                        </View>
                    )
                })
            )}

            {!dragMode && (
                <View style={styles.selectionContainer}>
                    <Text style={styles.selectionTitle}>Crear un nuevo campo</Text>
                    <Select
                        selectedIndex={selectedIndex}
                        value={selectedField}
                        onSelect={(itemValue) => {
                            setSelectedIndex(itemValue)
                            setSelectedField(fieldTypes[itemValue - 1])
                        }}
                        placeholder="Seleccione un tipo de campo"
                    >
                        {Object.keys(fields).map((fieldType) => (
                            <SelectItem title={fieldType} key={fieldType} />
                        ))}
                    </Select>
        
                    <Button
                        title="Agregar nuevo campo"
                        onPress={handleNewField}
                        disabled={!selectedIndex}
                    >
                        Agregar nuevo campo
                    </Button>
                </View>
            )}
            
            <Button onPress={() => handleSave()}>Guardar Formulario</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5'
    },
    containerBox: {
        padding: 10,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#ffffff', 
        borderWidth: 1,
        borderColor: '#00b7ae',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: "10%" },
        shadowOpacity: 0.9,
        shadowRadius: 2,
        elevation: 3,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    fieldContainer: {
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff'
    },
    selectionContainer: {
        marginTop: 10,
        padding: 16,
        borderWidth: 2,
        borderColor: '#6200ea',
        borderRadius: 12,
        backgroundColor: '#e8eaf6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 10
    },
    selectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6200ea',
        marginBottom: 12,
        textAlign: 'center'
    },
    disButton: {
        marginTop: 16,
        borderRadius: 8,
        paddingVertical: 10
    },
    addButton: {
        marginTop: 16,
        borderRadius: 8,
        backgroundColor: '#6200ea',
        paddingVertical: 10
    }
})


export default FieldSelector
