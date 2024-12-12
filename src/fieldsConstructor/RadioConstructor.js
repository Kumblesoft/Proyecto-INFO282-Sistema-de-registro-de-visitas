import React, { useState } from 'react'
import { View, Text, StyleSheet,FlatList } from 'react-native'
import { Input, Button, List, ListItem, Icon,Toggle, Layout, Divider} from '@ui-kitten/components'

const RadioConstructor = ({ field, onSave }) => {
    const [options, setOptions] = useState(field.opciones || [])
    const [newOptionName, setNewOptionName] = useState('')
    const [fieldName, setFieldName] = useState(field.nombre || '')
    const [isRequired, setIsRequired] = useState(field.isRequired ?? true)

    const saveIcon = props => <Icon name='save-outline' {...props} fill="#fff" style={[props.style, { width: 25, height: 25 }]}/>

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
            tipo: 'radio',
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
            <Text style={styles.title}>Nombre del Campo Radio</Text>

            <Divider />
            <View style={styles.field}>
                <Input
                    label={"Nombre del Campo"}
                    style={styles.input}
                    placeholder="Nombre del campo Radio"
                    value={fieldName}
                    onChangeText={setFieldName}
                />
            </View>
            <Divider />

            <View style={styles.field}>
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
                                size="medium"
                                status="danger"
                                onPress={() => removeOption(index)}
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
                {/* Obligatorio */}
                <View style={styles.field}>
                    <Text style={styles.label}>¿Es Obligatorio?</Text>
                    <Toggle style={{alignSelf: 'flex-start'}}checked={isRequired} onChange={setIsRequired} />
                </View>
                    
            <Divider />
            {/* Guardar */}
            <View style={styles.saveButtonContainer}>
                <Button accessoryLeft={saveIcon} title="Guardar Campo" onPress={handleSave}>
                    Guardar Campo
                </Button>        
            </View>
        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: "1%",
        backgroundColor: '#ffffff',
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
        marginBottom: 16,
        fontWeight: 'bold',
        fontSize: 18,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        marginBottom: "3%",

    },
    input: {
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 0,
        borderRadius: 4,
    },
    toggle: {
        marginLeft: 8,
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
        marginTop: "4%",
        marginBottom: "4%",
    },
    saveButtonContainer: {
        marginTop: 20,
        alignSelf: 'center',
    },
})

export default RadioConstructor
