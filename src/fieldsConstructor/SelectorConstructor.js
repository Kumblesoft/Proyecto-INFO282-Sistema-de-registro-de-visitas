import React, { useState } from 'react'
import { View, Text, StyleSheet,FlatList } from 'react-native'
import { Input, Button, List, ListItem, Icon,Toggle, Layout} from '@ui-kitten/components'

const SelectorConstructor = ({ field, onSave }) => {
    const [options, setOptions] = useState(field.opciones || [])
    const [newOptionName, setNewOptionName] = useState('')
    const [fieldName, setFieldName] = useState(field.nombre || '')
    const [isRequired, setIsRequired] = useState(field.isRequired ?? true)

    const handleAddOption = () => {
        setOptions((prevOptions) => [
            ...prevOptions,
            { nombre: `Nueva opción ${prevOptions.length + 1}`, valor: `opcion${prevOptions.length + 1}` }
        ])
    }


    const removeOption = (index) => {
        setOptions(options.filter((_, i) => i !== index))
    }

    const handleSave = () => {
        // Crear el objeto `field` con los datos
        const field = {
            nombre: fieldName,
            salida : fieldName.toLowerCase().replace(/ /g, '_'),
            "opcion predeterminada" : null,  // no se que es
            "texto predeterminado" :  fieldName, // no se que es  
            tipo: 'selector',
            opciones: options,
            obligatorio: isRequired,
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
                                onPress={() => removeOption(index)}
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
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 16,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    field: {
        marginBottom: 14,
    },
    saveButtonContainer: {
        marginTop: 20,
        alignSelf: 'center',
    },
})

export default SelectorConstructor
