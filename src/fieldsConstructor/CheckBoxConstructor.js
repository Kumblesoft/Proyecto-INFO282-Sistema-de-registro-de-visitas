import React, { useState, useEffect  } from 'react'
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
    Divider,
} from '@ui-kitten/components'


const useToggleState = (initialState = false) => {
    const [checked, setChecked] = React.useState(initialState);

    const onCheckedChange = (isChecked) => {
        setChecked(isChecked);
    };

    return { checked, onChange: onCheckedChange };
};

const CheckBoxConstructor = ({ onSave, field = {} }) => {

    
    const [stateRequired, setStateRequired] = useState(true)
    const [fieldName, setFieldName] = useState(field.nombre || '')
    const [options, setOptions] = useState(field.opciones || [])
    const [maxSelections, setMaxSelections] = useState(field['cantidad de elecciones'] || 1)
    const [isRequired, setIsRequired] = useState(field.isRequired ?? (true ? false : true))

    const saveIcon = props => <Icon name='save-outline' {...props} fill="#fff" style={[props.style, { width: 25, height: 25 }]}/>

    const deleteIcon = props => <Icon name='trash-outline' {...props} fill="#fff" style={[props.style, { width: 25, height: 25 }]}/>

    const onChangeRequired = () => {
        console.log(isRequired)
        setIsRequired((prev) => !prev)
    }
    
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

                <Divider />
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

                <Divider />
                {/* Opciones */}
                <View style={styles.field}>
                    <Text category="s1" style={styles.label}>
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
                                    size="medium"
                                    status="danger"
                                    onPress={() => handleRemoveOption(index)}
                                    accessoryLeft={<Icon name={'trash-outline'}/>}
                                >
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
                
                <Divider />
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

                <Divider />

                {/* Obligatorio */}
                <View style={styles.field}>
                    <Text style={styles.label}>¿Es Obligatorio?</Text>
                    <Toggle style={{alignSelf: 'flex-start'}}  checked={isRequired} onChange={() => onChangeRequired()}/>
                
                </View>

                <Divider />

                {/* Guardar */}
                <View style={styles.saveButtonContainer}>
                    <Button accessoryLeft={saveIcon} title="Guardar Campo" onPress={handleSave}>
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
    saveButtonContainer: {
        marginTop: 20,
        alignSelf: 'center',
    },
})

export default CheckBoxConstructor
