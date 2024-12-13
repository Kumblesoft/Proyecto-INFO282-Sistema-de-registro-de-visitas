import React, { useState} from 'react'
import { View, Alert, StyleSheet } from 'react-native'
import { Text, Input, Button, Toggle, Layout, Divider, Icon, CheckBox, RadioGroup, Radio } from '@ui-kitten/components'
import { TimerPickerModal } from 'react-native-timer-picker'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'


const HourConstructor = ({ field = {}, onSave }) => {
    // Obtener hora actual en formato hh:mm
    const getCurrentTime = () => {
        const now = new Date()
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    }

    // Estados
    const [fieldName, setFieldName] = useState(typeof field.nombre === 'string' ? field.nombre : '')
    const [defaultHour, setDefaultHour] = useState(field.hora_predeterminada || 'actual')
    const [isEditable, setIsEditable] = useState(field.isEditable || false)
    const [showPicker, setShowPicker] = useState(false)
    const [isActual, setIsActual] = useState(defaultHour === 'actual' || !field.hora_predeterminada)
    const [selectedIndex, setSelectedIndex] = useState(0);

    const options = ["Hora Actual", "Hora Personalizada"];

    const saveIcon = props => <Icon name='save-outline' {...props} fill="#fff" style={[props.style, { width: 25, height: 25 }]}/>
    const formatTime = ({ hours, minutes }) =>
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    const handleSave = () => {
        if (!fieldName || typeof fieldName !== 'string' || !fieldName.trim()) {
            Alert.alert('Error', 'El nombre del campo no puede estar vacío.')
            return
        }

        if (defaultHour !== 'actual' && !/^\d{2}:\d{2}$/.test(defaultHour)) {
            Alert.alert('Error', "La hora predeterminada debe ser 'actual' o estar en formato hh:mm.")
            return
        }

        const field = {
            nombre: fieldName,
            'hora predeterminada': defaultHour,
            salida: fieldName.toLowerCase().replace(/ /g, '_'),
            limitaciones: {
                tipo: 'ArregloFecha',
                compatibilidadLimitaciones: [
                    [1, 0],
                    [0, 1]
                ],
                enumLimitaciones: isEditable ? 'editable' : 'no editable'
            }
        }

        if (onSave) {
            console.log(field)
            onSave(field)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configurar Campo de Hora</Text>

            <Divider />
            {/* Nombre del Campo */}
            <View style={styles.field}>
                <Input
                    label={"Nombre del Campo"}
                    value={fieldName}
                    onChangeText={setFieldName}
                    placeholder="Nombre del campo Hora"
                    style={styles.input}
                />
            </View>

            <Divider />
            {/* Hora Predeterminada */}
            <View style={styles.field}>
                <Text style={styles.subtitle}>Hora Predeterminada</Text>
                <RadioGroup
                    style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: '4%', marginTop: '1%' }}
                    selectedIndex={selectedIndex}
                    onChange={(index) => {
                        setSelectedIndex(index);

                        if (index === 0) {
                        // Acción para Hora Actual
                        setIsActual(true);
                        setDefaultHour(getCurrentTime());
                        } else {
                        // Acción para Hora Personalizada
                        setIsActual(false);
                        setDefaultHour('00:00');
                        }
                    }}
                >
                    <Radio 
                        style={{ marginVertical: 8 }}
                    >
                        Hora Actual
                    </Radio>
                    <Radio 
                        style={{ marginVertical: 8 }}
                    >
                        Hora Personalizada
                    </Radio>
                </RadioGroup>
                
                {/* Selector de hora personalizada */}
                {!isActual ? (
                    <Button
                        status="success"
                        onPress={() => setShowPicker(true)}
                        appearance="outline"
                        size="large"
                    >
                        {defaultHour}
                    </Button>
                ) : (
                    <Button
                        status= "success"
                        disabled={true}
                        appearance="outline"
                        size="large"
                        style={{ opacity: 0.9, borderColor: '#cccccc'}}
                    >
                        {"La hora será definida al momento de llenar el formulario"}
                    </Button>
                )}

                <TimerPickerModal
                    visible={showPicker}
                    setIsVisible={setShowPicker}
                    onConfirm={(pickedDuration) => {
                        setDefaultHour(formatTime(pickedDuration))
                        setShowPicker(false)
                    }}
                    modalTitle="Selecciona una hora"
                    onCancel={() => setShowPicker(false)}
                    closeOnOverlayPress
                    LinearGradient={LinearGradient}
                    Haptics={Haptics}
                    styles={{
                        theme: 'light'
                    }}
                    modalProps={{
                        overlayOpacity: 0.2
                    }}
                    hideSeconds={true}
                    agressivelyGetLatestDuretion={true}
                />
            </View>
                
            <Divider />    
            {/* Editable */}
            <View style={styles.field}>
                <Text style={styles.subtitle}>Características opcionales</Text>
                <CheckBox style={{margin: '2%', alignSelf: 'flex-start', marginTop: '4%'}} checked={isEditable} onChange={setIsEditable}>Obligatorio</CheckBox>
            </View>
                
            <Divider />
            {/* Botón Guardar */}
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 8,
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
        borderRadius: 4,
        padding: 0,
        fontSize: 16,
    },
    saveButtonContainer: {
        marginTop: 20,
        alignSelf: 'center',
    },
})

export default HourConstructor
