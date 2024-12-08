import React, { useState, useEffect, useRef } from 'react'
import { Layout, Text, Divider, Icon } from '@ui-kitten/components'
import CheckboxGroup from "./subcomponents/CheckboxGroup"
import ItemSelector from "./subcomponents/ItemSelector"
import RadioButtonGroup from "./subcomponents/RadioButtonGroup"
import { View, StyleSheet } from 'react-native'

/**
 * Enum for component types.
 *
 * @readonly
 * @enum {number}
 */
export const OptionComponentType = Object.freeze({
    DROPDOWN: 0,
    CHECKBOX: 1,
    RADIO: 2
})

/**
 * Defines the optional features of OptionSelector 
 * 
 * @param {Object} options - The options for the selector features.
 * @param {string} [options.title] - A string to display as the title.
 * @param {string} [options.placeholder] - A string to show when no option is selected (for Select).
 * @param {string} [options.defaultOption] - The value of the option displayed initially (for Select).
 * @param {boolean} [options.required=false] - Indicates whether the field is required.
 * @param {number} [options.maxChecked] - Max options to check in checkbox group.
 * @param {boolean} [options.disabled] - Indicates whether the field is disabled.
* @returns {OptionSelectorFeatures} - The optional features of OptionSelector.
 */
export const OptionSelectorFeatures = options => {
    return {
        title: options.title,
        placeholder: options.placeholder,
        defaultOption: options.defaultOption,
        required: options.required ?? false, // Usa false como valor por defecto
        maxChecked: options.maxChecked,
        disabled: options.disabled
    }
}

/**
 * A component that instantiates Select, Checkbox, or Radio groups according to a list of items.
 *
 * @param {OptionComponentType} type - The type of selector to generate. Please check the OptionComponentType enum. Default: Dropdown.
 * @param {Item[]} items - A list of items to display.
 * @param {function} [onSelect] - A callback function triggered when the user selects an item or items, `(selectedItem) => {}`.
 * @param {OptionSelectorFeatures} - An object that defines the optional properties of the object.
 * @param {function} [requiredFieldRef] - A reference to validate if the field is required and show an error message.
 * @returns {JSX.Element} The rendered component based on the specified type.
 */
export default function OptionSelector({ type, items, onSelect, requiredFieldRef, optionalFeatures , refreshFieldRef}) {
    type ??= OptionComponentType.DROPDOWN
    optionalFeatures ??= {}

    const { title, placeholder, defaultOption, required, maxChecked, disabled} = optionalFeatures
    const [selectedValue, setSelectedValue] = useState(defaultOption || null) // Usar la opción predeterminada como estado inicial
    const [isRequiredAlert, setIsRequiredAlert] = useState(false)


    if (selectedValue){
        onSelect(selectedValue)
    }
    const optionRef = useRef()
    // Lógica para manejar la selección
    const handleSelect = selectedValue => {
        setSelectedValue(selectedValue) // Actualizar el estado con el valor seleccionado
        setIsRequiredAlert(false) // Limpiar error cuando el usuario selecciona algo
        if (onSelect) onSelect(selectedValue) // Ejecutar la función de selección pasada como prop
    }

    // Lógica para verificar si el campo es obligatorio y está vacío al enviar el formulario
    requiredFieldRef.current = () => {
        if (required && !selectedValue) {
            setIsRequiredAlert(true)
        } else {
            setIsRequiredAlert(false)
        }
      }
    

    // Renderizar el componente correcto basado en `type`
    const SelectedComponent = Selectors[type] // Selecciona el componente correspondiente según `type`
    const emptyValue = (selectedValue == null)
    refreshFieldRef.current = () => {
        optionRef.current.refreshSelector()
        setSelectedValue(defaultOption)
    }
    return (
        <>
            <Layout style={styles.containerBox}>
                {!title ? <></> : 
                    <Text category="h6" style={styles.titles}>
                        {title}
                        {required ? <Text style={{ color: 'red' }}>*</Text> : ""}
                        {maxChecked != null ? ` (Seleccione ${maxChecked})` : ""}
                    </Text>
                }
                <SelectedComponent
                    items={items} // Pasar los ítems
                    onSelect={handleSelect} // Función de manejo de selección
                    placeholder={placeholder || "Seleccione una opción"} // Asignar el placeholder si no se pasa uno
                    value={selectedValue} // Pasar el valor actual
                    defaultOption={defaultOption} // Opcion predeterminada
                    maxChecked={maxChecked}
                    ref = {optionRef}
                    disabled = {disabled}
                />
                { isRequiredAlert ?
                    <Layout size='small' style={styles.alert}>
                        <Icon status='danger' fill='#FF0000' name='alert-circle'style={styles.icon}/> 
                        <Text style={styles.alert} category="p2">
                            Debe rellenar este campo.
                        </Text>
                    </Layout>
                    :
                    <></>
                }
            </Layout>
        </>
    )
}

const styles = StyleSheet.create({
    containerBox: {
        padding: 10,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#ffffff', // Color fondo suave
        borderWidth: 1,
        borderColor: '#00b7ae',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.9,
        shadowRadius: 2,
        elevation: 3,
        alignItems: 'flex-start'
    },
    titles: {
        fontWeight: 'bold',
        marginBottom: 10,
        margin: 2,
    },
    alert: {
        flex: 1,
        margin: 1,
        marginHorizontal: '1%',
        color: '#ff0000',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'left',
      },
      icon: {
        width: 20,
        height: 20,
      },
})

// Arreglo de los componentes disponibles
const Selectors = [ItemSelector, CheckboxGroup, RadioButtonGroup]
