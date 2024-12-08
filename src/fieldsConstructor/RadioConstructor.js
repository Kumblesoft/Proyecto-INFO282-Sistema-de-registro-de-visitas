import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Input, Button, List, ListItem } from '@ui-kitten/components'

const RadioConstructor = ({ field, onSave }) => {
    const [fieldName, setFieldName] = useState(field.nombre || '') // Estado para el nombre del campo
    const [options, setOptions] = useState(field.opciones || []) // Estado para las opciones del radio
    const [newOptionName, setNewOptionName] = useState('') // Para el nombre de nueva opción
    const [maxSelections, setMaxSelections] = useState(field['cantidad de elecciones'] || 1) // Cantidad de elecciones
    const [error, setError] = useState('') // Estado para manejar mensajes de error

    const addOption = () => {
        if (newOptionName.trim()) {
            const newOption = { nombre: newOptionName, valor: newOptionName.toLowerCase().replace(/ /g, '_') }
            setOptions([...options, newOption])
            setNewOptionName('') // Limpiar el input después de agregar
        }
    }

    const removeOption = (index) => {
        setOptions(options.filter((_, i) => i !== index))
    }

    const editOption = (index, newName) => {
        const updatedOptions = options.map((option, i) =>
            i === index ? { ...option, nombre: newName, valor: newName.toLowerCase().replace(/ /g, '_') } : option
        )
        setOptions(updatedOptions)
    }

    const handleSave = () => {
        // Validación: la cantidad de elecciones no puede ser 0 o mayor al número de opciones
        if (maxSelections <= 0 || maxSelections > options.length) {
            setError(
                maxSelections <= 0
                    ? 'La cantidad de elecciones no puede ser 0.'
                    : 'La cantidad de elecciones no puede ser mayor al número de opciones.'
            )
            return
        }

        // Si no hay errores, proceder a guardar
        setError('') // Limpiar el mensaje de error si todo está correcto
        const field = {
            nombre: fieldName,
            salida: fieldName.toLowerCase().replace(/ /g, '_'),
            "texto predeterminado": fieldName,
            "opcion predeterminada": null,
            opciones: options,
            'cantidad de elecciones': maxSelections,
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
            <Text style={styles.title}>Nombre del Campo Radio</Text>

            {/* Campo para ingresar el nombre del campo */}
            <Input
                style={styles.input}
                placeholder="Nombre del campo Radio"
                value={fieldName}
                onChangeText={setFieldName}
            />

            <Text style={styles.subtitle}>Opciones:</Text>
            <List
                data={options}
                renderItem={renderOption}
            />

            <View style={styles.addOptionContainer}>
                <Input
                    style={styles.input}
                    placeholder="Nueva opción"
                    value={newOptionName}
                    onChangeText={setNewOptionName}
                />
                <Button onPress={addOption}>Agregar</Button>
            </View>

            <Text style={styles.subtitle}>Cantidad de elecciones:</Text>
            <Input
                style={styles.input}
                keyboardType="numeric"
                value={String(maxSelections)}
                onChangeText={(text) => setMaxSelections(Number(text))}
            />

            {/* Mensaje de error */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Botón para guardar y salir */}
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
    errorText: {
        color: 'red',
        marginTop: 8,
        marginBottom: 8,
    },
})

export default RadioConstructor
