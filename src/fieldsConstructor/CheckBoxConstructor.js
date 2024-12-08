import React, { useState } from 'react'
import {
    View,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Alert,
} from 'react-native'
import {
    Layout,
    Text,
    Input,
    Button,
    Toggle,
    Icon,
} from '@ui-kitten/components'

const CheckBoxConstructor = ({ onSave, field = {} }) => {
    const [fieldName, setFieldName] = useState(field.nombre || '')
    const [options, setOptions] = useState(field.opciones || [])
    const [maxSelections, setMaxSelections] = useState(field['cantidad de elecciones'] || 1)
    const [isRequired, setIsRequired] = useState(true)

    const handleAddOption = () => {
        setOptions((prevOptions) => [
            ...prevOptions,
            { nombre: `Nueva opción ${prevOptions.length + 1}`, valor: `opcion${prevOptions.length + 1}` }
        ])
    }

    const handleRemoveOption = (index) => {
        const updatedOptions = options.filter((_, idx) => idx !== index)
        setOptions(updatedOptions)
        if (maxSelections > updatedOptions.length) {
            setMaxSelections(updatedOptions.length)
        }
    }

    const handleSave = () => {
        if (!fieldName.trim()) {
            Alert.alert("Error", "El nombre del campo no puede estar vacío.")
            return
        }

        if (options.length === 0) {
            Alert.alert("Error", "Debe haber al menos una opción.")
            return
        }

        if (maxSelections <= 0 || maxSelections > options.length) {
            Alert.alert(
                "Error",
                maxSelections <= 0
                    ? "La cantidad máxima de selecciones debe ser al menos 1."
                    : "La cantidad máxima de selecciones no puede ser mayor que el número de opciones."
            )
            return
        }

        const field = {
            nombre: fieldName,
            opciones: options,
            salida: fieldName.toLowerCase().replace(/ /g, '_'),
            "opcion predeterminada": null,
            "texto predeterminado": fieldName,
            "cantidad de elecciones": maxSelections,
            obligatorio: isRequired,
        }

        if (onSave) {
            console.log(field)
            onSave(field)
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Layout style={styles.container}>
                <Text category="h5" style={styles.title}>
                    Configurar Campo CheckBox
                </Text>

                {/* Nombre del Campo */}
                <Input
                    label="Nombre del Campo"
                    placeholder="Nombre del campo"
                    value={fieldName}
                    onChangeText={setFieldName}
                    style={styles.input}
                />

                {/* Opciones */}
                <Text category="s1" style={styles.label}>
                    Opciones
                </Text>
                <FlatList
                    data={options}
                    renderItem={({ item, index }) => (
                        <Layout style={styles.optionRow}>
                            <Input
                                value={item.nombre}
                                OnChange={(text) => {
                                    const updatedOptions = [...options]
                                    updatedOptions[index].nombre = text
                                    setOptions(updatedOptions)
                                }}
                                style={styles.optionInput}
                            />
                            <Button
                                size="small"
                                status="danger"
                                onPress={() => handleRemoveOption(index)}
                            >
                                Eliminar
                            </Button>
                        </Layout>
                    )}
                    keyExtractor={(_, index) => index.toString()}
                    scrollEnabled={false}
                    ListFooterComponent={() => (
                        <Button onPress={handleAddOption} style={styles.addButton} accessoryRight={<Icon name={'plus-outline'}/>}>
                        </Button>
                    )}
                />

                {/* Cantidad de Elecciones */}
                <Input
                    label="Cantidad de Elecciones"
                    placeholder="Número de elecciones"
                    value={String(maxSelections)}
                    onChangeText={(text) => {
                        const value = Number(text)
                        if (!isNaN(value) && value >= 0) {
                            setMaxSelections(value)
                        } else {
                            Alert.alert("Error", "Por favor ingrese un número válido.")
                        }
                    }}
                    keyboardType="numeric"
                    style={styles.input}
                />

                {/* Obligatorio */}
                <Layout style={styles.toggleRow}>
                    <Text category="s1">¿Es Obligatorio?</Text>
                    <Toggle
                        checked={isRequired}
                        onChange={setIsRequired}
                        style={styles.toggle}
                    />
                </Layout>

                {/* Guardar */}
                <Button onPress={handleSave} style={styles.saveButton}>
                    Guardar Campo
                </Button>
            </Layout>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    optionInput: {
        flex: 1,
        marginRight: 8,
    },
    addButton: {
        marginTop: 8,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    toggle: {
        marginLeft: 8,
    },
    saveButton: {
        marginTop: 16,
    },
})

export default CheckBoxConstructor
