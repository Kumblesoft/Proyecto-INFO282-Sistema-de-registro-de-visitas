import React, { useState } from 'react'
import { View, TextInput, Switch, StyleSheet, Alert } from 'react-native'
import {Text, Input, Button, Toggle, Icon, Layout, ButtonGroup} from '@ui-kitten/components'
import { TimerPickerModal } from 'react-native-timer-picker'
import * as Haptics from "expo-haptics" // for haptic feedback
import { LinearGradient } from "expo-linear-gradient"

const HourConstructor = ({ field = {}, onSave }) => {
    const [fieldName, setFieldName] = useState(field.nombre || '')
    const [defaultHour, setDefaultHour] = useState(field.hora_predeterminada || '00:00')
    const [isEditable, setIsEditable] = useState(field.isEditable || false) // Valor predeterminado corregido
    const [showPicker, setShowPicker] = useState(false)
    const [isActual, setIsActual] = useState(true)

    const formatTime = ({hours, minutes}) => `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    const handleSave = () => {
        // Validar valores antes de guardar
        if (!fieldName.trim()) {
            Alert.alert("Error", "El nombre del campo no puede estar vacío.")
            return
        }

        if (defaultHour !== "actual" && !/^\d{2}:\d{2}$/.test(defaultHour)) {
            Alert.alert(
                "Error",
                "La hora predeterminada debe ser 'actual' o estar en formato hh:mm."
            )
            return
        }

        const field = {
            nombre: fieldName,
            "hora predeterminada": defaultHour,
            salida: fieldName.toLowerCase().replace(/ /g, '_'),
            limitaciones: {
                tipo: "ArregloFecha",
                compatibilidadLimitaciones: [
                    [1, 0],
                    [0, 1]
                ],
                enumLimitaciones: isEditable ? "editable" : "no editable"
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

            {/* Nombre del Campo */}
            <View style={styles.field}>
                <Text style={styles.label}>Nombre del Campo</Text>
                <TextInput
                    value={fieldName}
                    OnChange={setFieldName}
                    placeholder="Nombre del campo"
                    style={styles.input}
                />
            </View>

            {/* Hora Predeterminada */}
            <View style={styles.field}>
            <Text style={styles.label}>Hora Predeterminada</Text>
            <Layout style={{flexDirection: 'row', alignItems: 'center'}}>
                <Button status={isActual ? 'primary' : 'basic'} 
                    onPress={() => {setIsActual(true)
                    setDefaultHour('actual')
                    }}>Actual</Button>
                <Button status={!isActual ? 'primary' : 'basic'}
                    onPress={() => {setIsActual(false)
                    setDefaultHour('00:00')
                    }}
                    >Personalizada</Button>
            </Layout>
            {!isActual ? (
                <Button
                status='success' 
                onPress={()=>setShowPicker(true)} 
                appearance='outline' 
                size='large'>{defaultHour}
                </Button>
            ): <></>}
            
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
                    theme: "light",
                }}
                modalProps={{
                    overlayOpacity: 0.2,
                }}
                hideSeconds={true}
                agressivelyGetLatestDuretion={true}
            />

            </View>

            {/* Editable */}
            <View style={styles.field}>
                <Text style={styles.label}>¿Editable?</Text>
                <Toggle
                    checked={isEditable}
                    onChange={setIsEditable}
                />
            </View>

            {/* Botón Guardar */}
            <View style={styles.saveButtonContainer}>
                <Button title="Guardar Campo" onPress={handleSave} > Guardar Campo </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    field: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 4,
        padding: 8,
        fontSize: 16,
    },
    saveButtonContainer: {
        marginTop: 24,
        alignSelf: 'center',
    },
})

export default HourConstructor
