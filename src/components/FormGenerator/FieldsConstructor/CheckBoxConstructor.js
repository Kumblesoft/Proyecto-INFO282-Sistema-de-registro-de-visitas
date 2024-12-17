import React, { useState } from 'react'
import { View, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Alert } from 'react-native'
import { Layout, Text, Input, Button, Icon, CheckBox, Divider } from '@ui-kitten/components'

const CheckBoxConstructor = ({ onSave, field = {} }) => {
    const [fieldName, setFieldName] = useState(field.nombre || '')
    const [options, setOptions] = useState(field.opciones || [])
    const [maxSelections, setMaxSelections] = useState(field['cantidad de elecciones'] || 1)
    const [isRequired, setIsRequired] = useState(field.isRequired ?? true)

    const saveIcon = props => <Icon name='save-outline' {...props} fill="#fff" style={[props.style, { width: 25, height: 25 }]}/>

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
            tipo: 'checkbox',
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
            <Layout category='h5' style={styles.container}>
                <Text style={styles.title}> Configurar Campo CheckBox </Text>
                
                <Divider/>
                {/* Nombre del Campo */}
                <View style={styles.field}>
                    <Input
                        label={"Nombre del Campo"}
                        style={styles.input}
                        placeholder="Nombre del campo Checkbox"
                        value={fieldName}
                        onChangeText={setFieldName}
                    />
                </View>

                <Divider/>

                {/* Opciones */}
                <View style={styles.field}>
                    <Text category="s1" style={styles.subtitle}>
                        Opciones
                    </Text>
                    <FlatList
                        data={options}
                        renderItem={({ item, index }) => (
                            <Layout style={styles.optionRow}>
                                <Input
                                    value={item.nombre}
                                    onChangeText={(text) => {
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
                </View>

                <Divider/>

                {/* Cantidad de Elecciones */}
                <View style={styles.field}>
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
                </View>


                <Divider/>

                {/* Obligatorio */}
                <View style={styles.field}>
                    <Text style={styles.subtitle}>Características opcionales</Text>
                    <CheckBox
                        style={{
                            alignSelf: "flex-start",
                            margin: "2%",
                            marginTop: "4%",
                        }}
                        status='success'
                        checked={isRequired}
                        onChange={setIsRequired}
                    >
                        Obligatorio
                    </CheckBox>
                </View>
                    
                <Divider/>
                {/* Guardar */}
                <View style={styles.saveButtonContainer}>
                    <Button accessoryLeft={saveIcon} onPress={handleSave}>
                        Guardar Campo
                    </Button>
                </View>
            </Layout>
        </KeyboardAvoidingView>
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
    subtitle: {
        fontSize: 16,
        marginBottom: 8,
    },
    field: {
        marginTop: "4%",
        marginBottom: "4%",
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
    saveButtonContainer: {
        marginTop: 20,
        alignSelf: 'center',
    },
})

export default CheckBoxConstructor
