import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Input, Button, List, ListItem, CheckBox,Toggle } from '@ui-kitten/components'

const TextoConstructor = ({ field, onSave }) => {
    const enumLimitaciones = {
        "solo letras": 0,
        "solo números": 1,
        "solo enteros": 2,
        "solo enteros positivos y cero": 3,
        "email": 4,
        "no números": 5,
    }

    const enumFormato = {
        "solo mayúsculas": 0,
        "solo minúsculas": 1,
    }

    const compatibilidadesLimitaciones = [
        [1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 0, 0],
        [0, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 1],
    ]
    

    const compatibilidadFormato = [
        [1, 1], // "solo letras"
        [0, 0], // "solo números" (ambos formatos deshabilitados)
        [0, 0], // "solo enteros" (ambos formatos deshabilitados)
        [0, 0], // "solo enteros positivos y cero" (ambos formatos deshabilitados)
        [1, 1], // "email"
        [1, 1], // "no números"
    ]
    console.log(field)
    const [fieldName, setFieldName] = useState(field.name?? '')
    const [selectedLimitaciones, setSelectedLimitaciones] = useState([])
    const [selectedFormato, setSelectedFormato] = useState(field.formato?? null)
    const [isRequired, setIsRequired] = useState(field.isRequired ?? true)
    const [isRequiredQR, setIsRequiredQR] = useState(field.isRequiredQR ?? false)

    const toggleLimitacion = (index) => {
        if (selectedLimitaciones.includes(index)) {
            setSelectedLimitaciones(selectedLimitaciones.filter(i => i !== index))
        } else {
            const newLimitaciones = [...selectedLimitaciones, index].filter(
                i => isLimitacionCompatible(i, [...selectedLimitaciones, index])
            )
            setSelectedLimitaciones(newLimitaciones)
        }

        if (
            selectedFormato !== null &&
            !isFormatoCompatibleWithLimitaciones(selectedFormato, [...selectedLimitaciones, index])
        ) {
            setSelectedFormato(null)
        }
    }

    const handleSelectFormato = (index) => {
        if (selectedFormato === index) {
            setSelectedFormato(null)
        } else if (isFormatoCompatibleWithLimitaciones(index, selectedLimitaciones)) {
            setSelectedFormato(index)
        }
    }

    const isLimitacionDisabled = (index) => {
        return selectedLimitaciones.length > 0 && !isLimitacionCompatible(index, selectedLimitaciones)
    }

    const isFormatoDisabled = (index) => {
        if (selectedLimitaciones.length === 0) return false
        return !isFormatoCompatibleWithLimitaciones(index, selectedLimitaciones)
    }

    const isLimitacionCompatible = (newLimitacion, currentLimitaciones) => {
        return currentLimitaciones.every(existing =>
            compatibilidadesLimitaciones[existing][newLimitacion]
        )
    }

    const isFormatoCompatibleWithLimitaciones = (formatoIndex, limitaciones) => {
        if (limitaciones.length === 0) return true
        return limitaciones.every(limitacion => compatibilidadFormato[limitacion][formatoIndex])
    }

    const handleSave = () => {
        const limitaciones = selectedLimitaciones.map(index =>
            Object.keys(enumLimitaciones).find(key => enumLimitaciones[key] === index)
        )

        const formato = Object.keys(enumFormato).find(key =>
            enumFormato[key] === selectedFormato
        )

        const field = {
            nombre: fieldName,
            salida: fieldName.toLowerCase().replace(/ /g, '_'),
            limitaciones,
            formato,
            obligatorio: isRequired,
            rellenarQR: isRequiredQR,
        }

        if (onSave) {
            console.log(field)
            onSave(field)
        }
    }

    const renderLimitacionItem = ({ item, index }) => (
        <ListItem
            title={item}
            accessoryLeft={() => (
                <CheckBox
                    checked={selectedLimitaciones.includes(index)}
                    onChange={() => toggleLimitacion(index)}
                    disabled={isLimitacionDisabled(index)}
                />
            )}
            style={isLimitacionDisabled(index) ? styles.disabledOption : null}
        />
    )

    const renderFormatoItem = ({ item, index }) => (
        <ListItem
            title={item}
            accessoryLeft={() => (
                <CheckBox
                    checked={selectedFormato === index}
                    onChange={() => handleSelectFormato(index)}
                    disabled={isFormatoDisabled(index)}
                />
            )}
            style={isFormatoDisabled(index) ? styles.disabledOption : null}
        />
    )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nombre del Campo Texto</Text>

            <Input
                style={styles.input}
                placeholder="Nombre del campo Texto"
                value={fieldName}
                onChangeText={setFieldName}
            />

            <Text style={styles.subtitle}>Limitaciones:</Text>
            <List
                data={Object.keys(enumLimitaciones)}
                renderItem={renderLimitacionItem}
            />

            <Text style={styles.subtitle}>Formato:</Text>
            <List
                data={Object.keys(enumFormato)}
                renderItem={renderFormatoItem}
            />

            {/* Respuesta por QR */}
            <View style={styles.field}>
                    <Text>¿Aceptar Respuesta por QR?</Text>
                    <Toggle checked={isRequiredQR} onChange={setIsRequiredQR} />
            </View>

            {/* Obligatorio */}
            <View style={styles.field}>
                    <Text>¿Es Obligatorio?</Text>
                    <Toggle checked={isRequired} onChange={setIsRequired} />
            </View>

             {/* Guardar */}
             <Button onPress={handleSave} style={styles.saveButton}>
                    Guardar Campo
            </Button>
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
    saveButton: {
        marginTop: 16,
    },
    disabledOption: {
        backgroundColor: '#f0d0d0',
    },
    field: {
        marginBottom: 0,
    },
    saveButtonContainer: {
        marginTop: 20,
        alignSelf: 'center',
    },
})

export default TextoConstructor
