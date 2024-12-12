import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Input, Button, List, ListItem, CheckBox,Toggle, Icon, Divider } from '@ui-kitten/components'

const TextoConstructor = ({ field, onSave }) => {

    const saveIcon = props => <Icon name='save-outline' {...props} fill="#fff" style={[props.style, { width: 25, height: 25 }]}/>

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

    const [fieldName, setFieldName] = useState('')
    const [selectedLimitaciones, setSelectedLimitaciones] = useState([])
    const [selectedFormato, setSelectedFormato] = useState(null)
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
            <Text style={styles.title}>Configurar Campo de Texto</Text>

            <Divider />
            <View style={styles.field}>
                <Input
                    label={"Nombre del Campo"}
                    style={styles.input}
                    placeholder="Nombre del campo de texto"
                    value={fieldName}
                    onChangeText={setFieldName}
                />
            </View>

            <Divider />

            <View style={styles.field}>
                <Text style={styles.subtitle}>Limitaciones:</Text>
                <List
                    data={Object.keys(enumLimitaciones)}
                    renderItem={renderLimitacionItem}
                />
            </View>

            <Divider />

            <View style={styles.field}>
                <Text style={styles.subtitle}>Formato:</Text>
                <List
                    data={Object.keys(enumFormato)}
                    renderItem={renderFormatoItem}
                />
            </View>

            <Divider />

            {/* Respuesta por QR */}
            <View style={styles.field}>
                    <Text style={styles.label}>¿Aceptar Respuesta por QR?</Text>
                    <Toggle style={{alignSelf: 'flex-start'}} checked={isRequiredQR} onChange={setIsRequiredQR} />
            </View>

            {/* Obligatorio */}
            <View style={styles.field}>
                    <Text style={styles.label}>¿Es Obligatorio?</Text>
                    <Toggle style={{alignSelf: 'flex-start'}} checked={isRequired} onChange={setIsRequired} />
            </View>

            <Divider/>
             {/* Guardar */}
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
    subtitle: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 0,
        borderRadius: 4,
    },
    label: {
        fontSize: 14,
        marginBottom: "3%",

    },
    saveButton: {
        marginTop: 16,
    },
    disabledOption: {
        backgroundColor: '#f0d0d0',
    },
    field: {
        marginTop: "4%",
        marginBottom: "4%",
    },
    saveButtonContainer: {
        marginTop: 20,
        alignSelf: 'center',
    },
})

export default TextoConstructor
