import React, { useState } from 'react'
import {
    View,
    Alert,
    StyleSheet
} from 'react-native'

import { Text, Input, Button, Toggle, Icon, Divider } from '@ui-kitten/components'

const CameraConstructor = ({ onSave, field = {} }) => {
    const [fieldName, setFieldName] = useState(field.nombre || '')
    const [isEditable, setIsEditable] = useState(field.editable || false)
    const [isRequired, setIsRequired] = useState(field.isRequired ?? true) // Por defecto, true
    
    const saveIcon = props => <Icon name='save-outline' {...props} fill="#fff" style={[props.style, { width: 25, height: 25 }]}/>

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

            <Divider />

            {/* Nombre del Campo */}
            <View style={styles.field}>
                <Input
                    label={"Nombre del Campo"}
                    value={fieldName}
                    onChangeText={setFieldName}
                    placeholder="Nombre del campo"
                    style={styles.input}
                />
            </View>

            
            <Divider />
            {/* Obligatorio */}
            <View style={styles.field}>
                <Text style={styles.label}>¿Es Obligatorio?</Text>
                <Toggle style={{alignSelf: 'flex-start'}} checked={isRequired} onChange={setIsRequired} />
            </View>

            <Divider />
            {/* Botón Guardar */}
            <View style={styles.saveButtonContainer}>
                <Button accessoryLeft={saveIcon} title="Guardar Campo" onPress={handleSave}>
                    Guardar Campo
                </Button>        
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: "1%",
        backgroundColor: '#ffffff',

    },
    title: {
        marginBottom: 16,
        fontWeight: 'bold',
        fontSize: 18,
    },
    field: {
        marginTop: "4%",
        marginBottom: "4%",
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 0,
        borderRadius: 4,
    },
    saveButtonContainer: {
        marginTop: 20,
        alignSelf: 'center',
    },
})

export default CameraConstructor
