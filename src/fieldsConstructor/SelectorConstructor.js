import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Input, Button, List, ListItem } from '@ui-kitten/components'

const SelectorConstructor = ({ field, onSave }) => {
    const [options, setOptions] = useState(field.opciones || [])
    const [newOptionName, setNewOptionName] = useState('')
    const [fieldName, setFieldName] = useState(field.nombre || '')

    const addOption = () => {
        if (newOptionName.trim()) {
            const newOption = {
                nombre: newOptionName,
                valor: newOptionName.toLowerCase().replace(/ /g, '_'), // Generar un identificador único
            }
            setOptions([...options, newOption])
            setNewOptionName('') // Limpiar el input
        }
    }

    const removeOption = (index) => {
        setOptions(options.filter((_, i) => i !== index))
    }

    const handleSave = () => {
        // Crear el objeto `field` con los datos
        const field = {
            nombre: fieldName,
            salida : fieldName.toLowerCase().replace(/ /g, '_'),
            "opcion predeterminada" : null,  // no se que es
            "texto predeterminado" :  fieldName, // no se que es  
            tipo: 'selector',
            opciones: options,
        }

        if (onSave) {
            console.log(field)
            onSave(field)
        }
    }

    const renderOption = ({ item, index }) => (
        <ListItem
            title={item.nombre}
            accessoryRight={() => (
                <Button size="tiny" status="danger" onPress={() => removeOption(index)}>
                    Eliminar
                </Button>
            )}
        />
    )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nombre del Campo Selector</Text>

            <Input
                style={styles.input}
                placeholder="Nombre del campo Selector"
                value={fieldName}
                onChangeText={setFieldName}
            />

            <Text style={styles.subtitle}>Opciones:</Text>
            <List data={options} renderItem={renderOption} />

            <View style={styles.addOptionContainer}>
                <Input
                    style={styles.input}
                    placeholder="Nueva opción"
                    value={newOptionName}
                    onChangeText={setNewOptionName}
                />
                <Button onPress={addOption}>Agregar</Button>
            </View>

            <Button onPress={handleSave}>Guardar y Salir</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        marginBottom: 8,
    },
    addOptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
})

export default SelectorConstructor
