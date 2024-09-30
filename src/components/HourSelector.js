import React, { useState } from 'react'
import { Button, Text, Layout } from '@ui-kitten/components'
import { StyleSheet, ScrollView, View } from 'react-native'
import { TimerPickerModal } from "react-native-timer-picker"
import { LinearGradient } from "expo-linear-gradient"
import * as Haptics from "expo-haptics" // for haptic feedback

/**
 * The setter for the optuinal features
 *
 * @param {options} OptionalTimeFeatures - options for the hour selector,
 * The options object can have the following properties:
 * @param {string} [options.title] - A string to display as the title.
 * @param {string} [options.defaulttime] - The initial string to show when selecting the hour.
 * @param {boolean} [options.disabled] - defines if the HourSelector field is enabled or disabled..
 * @param {boolean} [options.required=false] - Indicates whether the field is required.
 * @returns {OptionalTimeFeatures} - The Layout that displays the whole HourSelector.
 **/
export const OptionalTimeFeatures = options => {
    return {
        title: options.title,
        defaultTime: options.defaultTime ?? "00:00",
        disabled: options.disabled ?? false,
        required: options.required ?? false,
    }
}

/**
 * The logic and layout of the hour selector 
 * 
 * @param {string} value - define the current time
 * @param {Function} onChange - function used to update the current time.
 * @param {Object} OptionalTimeFeatures - options for the hour selector,
* @returns {Layout} - The Layout that displays the whole HourSelector.
 **/
const HourSelector = ({value, onChange, optionalFeatures}) => {
    const [showPicker, setShowPicker] = useState(false)
    optionalFeatures ??= {}

    const {title, defaultTime, disabled, required} = optionalFeatures

    const formatTime = ({hours, minutes}) => `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    var value = defaultTime

    const setNowTime = () => {
        onChange((new Date().getHours()).toString().padStart(2,"0") + ":" + (new Date().getMinutes()).toString().padStart(2,"0"))
    }

    return (
        <Layout>
            <Text>{required ? title + "*": title }</Text>
            <Button disabled={disabled} status='success' onPress={()=>setShowPicker(true)} appearance='outline' style={styles.hour} size='large'>{value}</Button>
            <Button style={styles.button} onPress={()=>setNowTime()}>{"Reset time"}</Button>
            <TimerPickerModal
                visible={showPicker}
                setIsVisible={setShowPicker}
                onConfirm={(pickedDuration) => {
                    onChange(formatTime(pickedDuration))
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

// Define the styles of the different elements of the hour selector
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
