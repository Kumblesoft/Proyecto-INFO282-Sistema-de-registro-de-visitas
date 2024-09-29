import React, { useState } from 'react'
import { Button, Text, Layout } from '@ui-kitten/components'
import { StyleSheet, ScrollView, View } from 'react-native'
import { TimerPickerModal } from "react-native-timer-picker"
import { LinearGradient } from "expo-linear-gradient"
import * as Haptics from "expo-haptics" // for haptic feedback

const HourSelector = ({time,setTime}) => {
    const [showPicker, setShowPicker] = useState(false)
    
    const limitations = {
        required: false,
        disable: false
    }

    const hourTitle = "Select a Hour"

    const formatTime = ({hours, minutes}) => `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    

    const setNowTime = () => {
        setTime((new Date().getHours()).toString().padStart(2,"0") + ":" + (new Date().getMinutes()).toString().padStart(2,"0"))
    }

    return (
        <Layout>
            <Text>{limitations["required"] ? hourTitle + "*": hourTitle }</Text>
            <Button disabled={limitations["disable"]} status='success' onPress={()=>setShowPicker(true)} appearance='outline' style={styles.hour} size='large'>{time}</Button>
            <Button style={styles.button} onPress={()=>setNowTime()}>Reset time</Button>
            <TimerPickerModal
                visible={showPicker}
                setIsVisible={setShowPicker}
                onConfirm={(pickedDuration) => {
                    setTime(formatTime(pickedDuration))
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
        </Layout>   
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    pickerContainer: {
        flexDirection: 'row',
        marginVertical: 20,
    },
    timeText: {
        fontSize: 20,
        paddingVertical: 10,
        marginHorizontal: 5,
    },
    selectedText: {
        fontWeight: 'bold',
        fontSize: 24,
        color: '#3366FF', // Color para el texto seleccionado
    },
    periodContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    selectedTime: {
        marginVertical: 20,
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
    },
    hour: {
        margin: 2,
        paddingVertical: 12,
        paddingHorizontal: 120,
    },
    button: {
        margin: 2,
        paddingVertical: 12,
        paddingHorizontal: 12,
    }
})

export default HourSelector
