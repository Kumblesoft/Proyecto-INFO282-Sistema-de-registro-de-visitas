import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Input, Button, Icon, Layout, Divider, CheckBox, Select, SelectItem } from '@ui-kitten/components'

const SelectorConstructor = ({ field, onSave }) => {
    const [options, setOptions] = useState(field.opciones || [])
    const [fieldName, setFieldName] = useState(field.nombre || '')
    const [isRequired, setIsRequired] = useState(field.isRequired ?? true)
    const [defaultOption, setDefaultOption] = useState(field.opcionPredeterminada || null) 
    const [defaultText, setDefaultText] = useState(field.textoPredeterminado || null)

    const [showOptions, setShowOptions] = useState(false)
    const [showOptionalFeatures, setShowOptionalFeatures] = useState(false)

    const [showDefaultText, setShowDefaultText] = useState(false)
    const [showDefaultOption, setShowDefautlOption] = useState(false)

    const handleAddOption = () => {
        setOptions((prevOptions) => [
            ...prevOptions,
            { nombre: `Nueva opción ${prevOptions.length + 1}`, valor: `Opcion ${prevOptions.length + 1}`} 
        ])
    }

    const removeOption = index => setOptions(options.filter((_, i) => i !== index))

    const handleSave = () => {
        // Crear el objeto `field` con los datos
        const field = {
            tipo: 'selector',
            nombre: fieldName,
            salida : fieldName.toLowerCase().replace(/ /g, '_'),
            "opcion predeterminada" : defaultOption,  // no se que es
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

    React.useEffect(() => { handleSave() }, [options, fieldName, isRequired, defaultText, defaultOption])

    return (
        <Layout style={styles.container}>
            <Text style={styles.title}>{fieldName || 'Nuevo campo selector'}</Text>

            <Divider />

            <View style={styles.field}>
                <Input
                    label={"Nombre del campo"}
                    style={styles.input}
                    placeholder="Nombre del campo Selector"
                    value={fieldName}
                    onChangeText={setFieldName}
                />
            </View>

            <Divider />

            <View style={styles.field}>
                <TouchableOpacity style={styles.headerRow} onPress={() => setShowOptions(!showOptions)}>
                    <Text style={[styles.subtitle, options.length || {color: 'red'}]}>Opciones</Text>
                    <Button
                        appearance='ghost'
                        accessoryLeft={props => <Icon name={showOptions ? 'arrow-ios-upward-outline' : 'arrow-ios-downward-outline'} {...props} />}
                        onPress={() => setShowOptions(!showOptions)}
                        style={styles.toggleButton}
                    />
                </TouchableOpacity>
                {showOptions && (
                    <FlatList
                        data={options}
                        renderItem={({ item, index }) => (
                            <Layout key={index} style={styles.optionRow}>
                                <Input
                                    value={item.nombre}
                                    onChangeText={text => {
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
                        keyExtractor={(item, index) => item.valor}
                        scrollEnabled={false}
                        ListFooterComponent={() => (
                            <Button onPress={handleAddOption} style={styles.addButton} accessoryRight={<Icon name={'plus-outline'} />}>
                                Agregar opción
                            </Button>
                        )}
                    />
                )}
            </View>
            <Divider />
            {/* Obligatorio */}
            
            <View style={styles.field}>
                <TouchableOpacity style={styles.headerRow} onPress={() => setShowOptionalFeatures(!showOptionalFeatures)}>
                    <Text style={styles.subtitle}>Características opcionales</Text>
                    <Button
                        appearance='ghost'
                        accessoryLeft={props => <Icon name={showOptionalFeatures ? 'arrow-ios-upward-outline' : 'arrow-ios-downward-outline'} {...props} />}
                        onPress={() => setShowOptionalFeatures(!showOptionalFeatures)}
                        style={styles.toggleButton}
                    />
                </TouchableOpacity>
                {showOptionalFeatures && (
                    <View style={styles.submenu}>
                        <CheckBox style={{ margin: '2%', alignSelf: 'flex-start', marginTop: '4%' }} checked={isRequired} onChange={setIsRequired}>
                            Obligatorio
                        </CheckBox>
                        <CheckBox style={{ margin: '2%', alignSelf: 'flex-start', marginTop: '4%' }} checked={showDefaultText} onChange={setShowDefaultText}>
                            <Text>Texto predeterminado</Text>
                        </CheckBox>
                            {showDefaultText && <Input style={{paddingLeft: '10%', flex:1}} placeholder='Seleccione una opcion...' onChangeText={setDefaultText}></Input>}
                        <CheckBox disabled={!options.length} style={{ margin: '2%', alignSelf: 'flex-start', marginTop: '4%' }} checked={options.length && showDefaultOption} onChange={v => setShowDefautlOption(v)}>
                            <Text>Opción predeterminada</Text>
                        </CheckBox>
                            {showDefaultOption && !!options.length && 
                                <Select style={{paddingLeft: '10%', flex:1}} placeholder='Seleccione una opcion...' value={defaultOption !== null ? options[defaultOption].valor : ''} onSelect={index => {
                                    const selectedOption = index.row
                                    console.log(selectedOption)
                                    if (selectedOption !== defaultOption) setDefaultOption(selectedOption)
                                }}>
                                    {options.map((option, i) =>  <SelectItem key={i} title={option.nombre} value={option.valor} /> )}
                                </Select>
                            }
                        
                    </View>
                )}
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
    addOptionContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: "4%",
        marginBottom: "4%",
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
    field: {
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Para que el botón esté a la derecha
        borderRadius: 4, // Bordes redondeados
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
        padding: 8,
    },
    submenu: {
        marginLeft: "4%", // Mover los elementos levemente a la derecha
        marginBottom: "4%", // Mover los elementos levemente hacia abajo
        borderLeftWidth: 4, // Solo el borde izquierdo
        borderLeftColor: '#cccccc', // Color del borde izquierdo
    },
})

export default SelectorConstructor
