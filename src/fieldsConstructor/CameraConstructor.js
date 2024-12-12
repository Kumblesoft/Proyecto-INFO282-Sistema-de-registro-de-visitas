import React, { useState } from 'react'
import {
    View,
    Alert,
    StyleSheet
} from 'react-native'

import { Text, Input, Button, Toggle } from '@ui-kitten/components'

const CameraConstructor = ({ onSave, field = {} }) => {
    const [fieldName, setFieldName] = useState(field.nombre || '')
    const [isEditable, setIsEditable] = useState(field.editable || false)
    const [isRequired, setIsRequired] = useState(field.isRequired ?? true) // Por defecto, true

    const handleSave = () => {
        // Validar el nombre del campo
        if (!fieldName.trim()) {
            Alert.alert("Error", "El nombre del campo no puede estar vacío.")
            return
        }

        const field = {
            nombre: fieldName,
            salida: fieldName.toLowerCase().replace(/ /g, '_'),
            editable: isEditable,
            obligatorio: isRequired // Agregar valor al objeto field
        }

        if (onSave) {
            console.log(field)
            onSave(field)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configurar Campo de Cámara</Text>

            {/* Nombre del Campo */}
            <View style={styles.field}>
                <Text>Nombre del Campo</Text>
                <Input
                    value={fieldName}
                    onChangeText={setFieldName}
                    placeholder="Nombre del campo"
                    style={styles.input}
                />
            </View>

            

            {/* Obligatorio */}
            <View style={styles.field}>
                <Text>¿Es Obligatorio?</Text>
                <Toggle checked={isRequired} onChange={setIsRequired} />
            </View>

            {/* Botón Guardar */}
            <Button onPress={handleSave} style={styles.saveButton}>
                Guardar Campo
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16
    },
    field: {
        marginBottom: 0
    },
    input: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 4,
        padding: 8
    },
    saveButton: {
        marginTop: 16
    }
})

export default CameraConstructor
