//esto es una plantilla de formulario para usar por mientras
import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, Text, TextInput } from 'react-native'
import EntradaTexto from '../components/EntradaTexto'
import SaveButton from '../components/SaveButton'
import OptionSelector, { OptionComponentType, OptionSelectorFeatures } from '../components/selector/OptionSelector'
import DateSelector from '../components/DateSelector'
import HourSelector from '../components/HourSelector'
import { Button } from '@ui-kitten/components'

const testItems = [
    { value: 'option1', name: 'Opción 1' },
    { value: 'option2', name: 'Opción 2' },
    { value: 'option3', name: 'Opción 3' }
]

// Campos del formulario
const testFields = {
    nombre: '',
    email: '',
    telefono: '',
}

export default function TestForm() {
    const [time, setTime] = useState("" + new Date().getHours().toString().padStart(2, "0") + ":" + new Date().getMinutes().toString().padStart(2, "0"))
    const [textData, setTextData] = useState(testFields)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [title, setTitle] = useState('')// Estado separado para el título
    const [dropdownValue, setDropdownValue] = useState(null); // Estado para Dropdown
    const [radioValue, setRadioValue] = useState(null); // Estado para Radio
    const [checkboxValues, setCheckboxValues] = useState([]); // Estado para Checkbox

    const handleChange = (name, value) => {
        setTextData({
            ...textData,
            [name]: value,
        })
    }
    const handleDropdownSelect = (value) => {
        setDropdownValue(value);
    };

    const handleRadioSelect = (value) => {
        setRadioValue(value);
    };

    const handleCheckboxSelect = (values) => {
        setCheckboxValues(values);
    };

    const saveButtonRef = SaveButton({
        title: title,
        formData: {
            ...textData,
            selectedDate,
            time,
            dropdownValue,
            radioValue,
            checkboxValues,
        }, // Incluyendo todas las selecciones
    });

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Formulario</Text>
            <View style={styles.container}>
                {/* Campo para el título del formulario */}
                <TextInput
                    placeholder="Ingrese el título del formulario"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.textInput} // Estilo para el campo de texto
                />

                <Text style={styles.title}>Select a Date</Text>
                <DateSelector
                    date={selectedDate}
                    onSelectDate={nextDate => setSelectedDate(nextDate)}
                />
                <Text style={styles.selectedDate}>Selected Date: {selectedDate.toDateString()}</Text>
                <Button onPress={() => setSelectedDate(new Date())} style={styles.clearButton}>
                    Reset to Today
                </Button>

                <OptionSelector 
                    items={testItems} 
                    type={OptionComponentType.DROPDOWN} 
                    onSelect={handleDropdownSelect} // Manejo de selección de Dropdown
                />
                <OptionSelector 
                    items={testItems} 
                    type={OptionComponentType.RADIO} 
                    onSelect={handleRadioSelect} // Manejo de selección de Radio
                    optionalFeatures={OptionSelectorFeatures({ title: "Selector Radio" })} 
                />
                <OptionSelector 
                    items={testItems} 
                    type={OptionComponentType.CHECKBOX} 
                    onSelect={handleCheckboxSelect} // Manejo de selección de Checkbox
                    optionalFeatures={OptionSelectorFeatures({ title: "Checkbox group", defaultOption: "option3", maxChecked: 2, required: true })} 
                />
                <EntradaTexto items={testFields} onSelect={handleChange} />
                <HourSelector time={time} setTime={setTime} />
            </View>

            <Button onPress={saveButtonRef.handleSubmit} style={styles.fixedButton}>
                Guardar
            </Button>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    scrollContent: {
        paddingBottom: 100, // Espacio para que no tape el botón al final
    },
    title: {
        marginBottom: 20,
        fontSize: 20,
        textAlign: 'center',
        color: '#333',
    },
    selectedDate: {
        marginVertical: 20,
        fontSize: 16,
    },
    clearButton: {
        marginVertical: 20,
    },
    fixedButton: {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: [{ translateX: -50 }],
        width: 100,
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '100%',
        borderRadius: 5,
    },
})