import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Switch,
    Alert
} from 'react-native'

const CameraConstructor = ({ onSave, field = {} }) => {
    const [fieldName, setFieldName] = useState(field.nombre || '')
    const [isEditable, setIsEditable] = useState(isEditable || false)

    const handleSave = () => {
        // Validar el nombre del campo
        if (!fieldName.trim()) {
            Alert.alert("Error", "El nombre del campo no puede estar vacío.")
            return
        }

    

        const field = {
            nombre: fieldName,
            salida: fieldName.toLowerCase().replace(/ /g, '_'),
            editable: isEditable,  // no se que es hace
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
                <TextInput
                    value={fieldName}
                    onChangeText={setFieldName}
                    placeholder="Nombre del campo"
                    style={styles.input}
                />
            </View>

            {/* Editable */}
            <View style={styles.field}>
                <Text>¿Es Editable?</Text>
                <Switch value={isEditable} onValueChange={setIsEditable} />
            </View>


            {/* Botón Guardar */}
            <Button title="Guardar Campo" onPress={handleSave} />
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
        marginBottom: 16
    },
    input: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 4,
        padding: 8
    },
    aspectRatioContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    aspectInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 4,
        padding: 8,
        marginHorizontal: 4
    },
    aspectSeparator: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 4
    }
})

export default CameraConstructor
