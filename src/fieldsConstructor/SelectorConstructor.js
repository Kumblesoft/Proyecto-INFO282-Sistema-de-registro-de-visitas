import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { Input, Button, ListItem, Icon, Toggle, Layout, CheckBox } from '@ui-kitten/components'



const SelectorConstructor = ({ field, onSave }) => {
    const [options, setOptions] = useState(field.opciones || [])
    const [fieldName, setFieldName] = useState(field.nombre || '')
    const [isRequired, setIsRequired] = useState(field.isRequired ?? true)


    const TrashIcon = (props) => (
        <Icon {...props} name='trash-2-outline' />
      );
    const handleAddOption = () => {
        setOptions((prevOptions) => [
            ...prevOptions,
            { nombre: `Nueva opción ${prevOptions.length + 1}`, valor: `opcion${prevOptions.length + 1}`, predeterminada: false }
        ])
    }

    const toggleDefaultOption = (index) => {
        setOptions((prevOptions) => {
            const updatedOptions = [...prevOptions]
            updatedOptions[index].predeterminada = !updatedOptions[index].predeterminada
            return updatedOptions
        })
    }

    const removeOption = (index) => {
        setOptions(options.filter((_, i) => i !== index))
    }

    const handleSave = () => {
        const predeterminada = options.filter(option => option.predeterminada)
    
        const field = {
            nombre: fieldName,
            salida: fieldName.toLowerCase().replace(/ /g, '_'),
            "opcion predeterminada": predeterminada.length > 0 ? predeterminada : null,
            tipo: 'selector',
            opciones: options,
            obligatorio: isRequired,
        }
    
        if (onSave) {
            console.log(field)
            onSave(field)
        }
    }
    

    return (
        <Layout style={styles.container}>
            <Text style={styles.title}>Nombre del Campo Selector</Text>

            <Input
                style={styles.input}
                placeholder="Nombre del campo Selector"
                value={fieldName}
                onChangeText={setFieldName}
            />

            <Text style={styles.subtitle}>Opciones:</Text>
            <FlatList
                data={options}
                renderItem={({ item, index }) => (
                    <Layout style={styles.optionContainer}>
                        <View style={styles.optionTopRow}>
                            <Input
                                value={item.nombre}
                                onChangeText={(text) => {
                                    const updatedOptions = [...options]
                                    updatedOptions[index].nombre = text
                                    setOptions(updatedOptions)
                                }}
                                style={styles.optionInput}
                                placeholder="Nombre de la opción"
                            />
                            <Button
                                size="small"
                                status="danger"
                                onPress={() => removeOption(index)}
                                accessoryLeft={TrashIcon}
                                style={styles.deleteButton}
                                >
                            </Button>
                        </View>
                        <View style={styles.checkboxRow}>
                            <CheckBox
                                checked={item.predeterminada}
                                onChange={() => toggleDefaultOption(index)}
                                style={styles.checkbox}
                            >
                                {evaProps => <Text {...evaProps} style={styles.checkboxLabel}>¿Predeterminada?</Text>}
                            </CheckBox>
                        </View>
                    </Layout>
                )}
                keyExtractor={(_, index) => index.toString()}
                scrollEnabled={false}
                ListFooterComponent={() => (
                    <Button onPress={handleAddOption} style={styles.addButton} accessoryRight={<Icon name={'plus-outline'} />}>
                        Agregar Opción
                    </Button>
                )}
            />

            {/* Obligatorio */}
            <View style={styles.field}>
                <Text>¿Es Obligatorio?</Text>
                <Toggle checked={isRequired} onChange={setIsRequired} />
            </View>

            {/* Guardar */}
            <Button onPress={handleSave} style={styles.saveButton}>
                Guardar Campo
            </Button>
        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    addButton: {
        marginTop: 8,
        marginBottom: 8,
    },
    optionInput: {
        flex: 1,
        marginRight: 8,
    },
    checkbox: {
        marginHorizontal: 8,
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
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    field: {
        marginBottom: 14,
    },
    saveButton: {
        marginTop: 16,
    },
    optionContainer: {
        marginBottom: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    optionTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start', // Correcto
    },
    checkboxLabel: {
        fontSize: 14,
    },
    deleteButton: {
        marginLeft: 8,
    },
})


export default SelectorConstructor