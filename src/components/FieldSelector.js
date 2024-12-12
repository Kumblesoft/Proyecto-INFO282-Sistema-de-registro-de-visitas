import React, { useState } from 'react'
import { View, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native'
import {Text, Select, SelectItem, Button, Layout, Divider, Icon} from '@ui-kitten/components'

import fields from '../fieldsConstructor/fields' // Ajusta la ruta correctamente
import SelectorConstructor from '../fieldsConstructor/SelectorConstructor'
import RadioSelectorConstructor from '../fieldsConstructor/RadioConstructor'
import TextoConstructor from '../fieldsConstructor/TextConstructor'
import HourConstructor from '../fieldsConstructor/HourConstructor'
import DateConstructor from '../fieldsConstructor/DateConstructor'
import CheckBoxConstructor from '../fieldsConstructor/CheckBoxConstructor'
import CameraConstructor from '../fieldsConstructor/CameraConstructor'
import DragList from 'react-native-draglist'

const { width, height } = Dimensions.get('window')

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

const FieldSelector = () => {
    const [selectedField, setSelectedField] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [fieldsToDisplay, setFieldsToDisplay] = useState([]) // Almacena los campos agregados
    const [miniFields, setMiniFields] = useState([]) // Almacena los campos agregados
    const [dragMode, setDragMode] = useState(false)
    const [form, setForm] = useState({})
    

    const deleteIcon = props => <Icon name='trash-outline' {...props} fill="#fff" style={[props.style, { width: 20, height: 20 }]}/>
    const editIcon = props => <Icon name='edit-outline' {...props} fill="#fff" style={[props.style, { width: 20, height: 20 }]}/>
    
    // Obtiene los tipos de campos del JSON (keys del objeto)
    const fieldTypes = Object.keys(fields)

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

    function renderItem(info) {
        const {item, onDragStart, onDragEnd, isActive} = info
        
        return (
        <TouchableOpacity 
            key={item}
            onPressIn={onDragStart} 
            onPressOut={onDragEnd}
            style={styles.containerBox}>
                    <Text>{item}</Text>
        </TouchableOpacity>
        )
    }

    async function onReordered(fromIndex, toIndex) {
        const copy = [...fieldsToDisplay]; // Don't modify react data in-place
        const removed = copy.splice(fromIndex, 1);

        copy.splice(toIndex, 0, removed[0]); // Now insert at the new pos
        setFieldsToDisplay(copy);
        // Mini fields
        const copyMini = [...miniFields]; // Don't modify react data in-place
        const removedMini = copyMini.splice(fromIndex, 1);

        copyMini.splice(toIndex, 0, removedMini[0]); // Now insert at the new pos
        setMiniFields(copyMini);

    }

    // Agregar un nuevo campo
    const handleNewField = () => {
        if (fields[selectedField]) {
            const copy = [...fieldsToDisplay]
            copy.push({ ...fields[selectedField], tipo: selectedField })

            const miniCopy = [...miniFields]
            miniCopy.push(fields[selectedField].nombre)
            setFieldsToDisplay(copy)
            setMiniFields(miniCopy)
            console.log(fieldNames)
        } else {
            console.log('Tipo de campo no implementado:', selectedField)
        }
    }

    function keyExtractor(str, _index) {
        return str;
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
                        setMiniFields(miniFields.filter((_, index) => index !== indexToDelete))
                        fieldNames.delete(fieldName)
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

    const handleDragMode = () => {
        if (miniFields.filter((field) => field === '').length > 0 || miniFields.length === 0) {
            console.log('No se pueden dejar campos vacíos')
            Alert.alert('Error', 'Los campos deben tener nombre')
        }else{
            setDragMode(!dragMode)
        }
    }

    const renderButtons = (index) => {
        <View style={styles.buttonContainer}>
            <Button style={styles.editButton} onPress={() => handleDragMode()}>{dragMode ? "Guardar Orden":"Editar Orden"}</Button>

        </View>
    }
    
    
    return (
        <>
        <View style={styles.container}>
            
            <Button style={styles.editButton} onPress={() => handleDragMode()}> {dragMode ? "Guardar Orden" : "Editar Orden"} </Button>

            {dragMode ? (
                <View style={styles.fieldContainer}>
                <DragList
                    data={miniFields}
                    keyExtractor={keyExtractor}
                    onReordered={onReordered}
                    renderItem={renderItem}
                />
                </View>
            ) : (
            fieldsToDisplay.map((item, index) => {
                const FieldComponent = constructors.get(item.tipo);

                return (
                    <View key={index}>
                    {/* Contenedor del campo */}
                    <View style={styles.fieldContainer}>
                        <FieldComponent
                        field={item}
                        onSave={(field) => handleFieldSave(field, index)}
                        />
                    </View>

                    {/* Botón "Eliminar Campo" */}
                    <View style={styles.buttonContainer}>
                        <Button
                        status="danger"
                        style={styles.deleteButton}
                        onPress={() => handleDeleteField(index)}
                        >
                        Eliminar Campo
                        </Button>
                    </View>
                    </View>
                );
            }))}
            
                
            <Divider />
            {/* Sección destacada */}
            {!dragMode ?(<View style={styles.selectionContainer}>
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
                    {fieldTypes.map((fieldType) => (
                        <SelectItem title={fieldType} key={fieldType} />
                    ))}
                </Select>
        
                <Button
                    title="Agregar nuevo campo"
                    onPress={handleNewField}
                    disabled={!selectedIndex}
                    style={selectedIndex ? styles.addButton : styles.disButton}
                    status={selectedIndex ? 'primary' : 'basic'}
                >
                    Agregar nuevo campo
                </Button>
            </View>) : <></>}
            
        
    </View>
    </>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: "4%",
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
        marginTop: "1%",
        marginBottom: "4%",
        padding: "4%",
        borderWidth: 1,
        borderColor: '#00b7ae',
        borderRadius: 8,
        backgroundColor: '#fff'
    },
    selectionContainer: {
        marginTop: 10,
        padding: 16,
        borderWidth: 2,
        borderColor: '#00b7ae',
        borderRadius: 12,
        backgroundColor: '#e8f6ee',
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
        color: '#00b7ae',
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
        paddingVertical: 10
    },
    buttonContainer: {
        backgroundColor: 'transparent',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginBottom: "4%",
    },
    deleteButton: {
        borderRadius: 5,
    },
    editButton: {
        borderRadius: 5,
    },
})


export default FieldSelector
