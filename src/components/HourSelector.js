import React, { useState} from 'react'
import { Button, Text, Layout, Icon } from '@ui-kitten/components'
import { View, StyleSheet } from 'react-native'
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
const HourSelector = ({onChange, optionalFeatures = {},requiredFieldRef}) => {
    const [showPicker, setShowPicker] = useState(false)
    const {title, defaultTime, disabled, required} = optionalFeatures
    const [hour,setHour] = useState(defaultTime)
    const [isRequiredAlert, setIsRequiredAlert] = useState(null)
    onChange(defaultTime)



    const formatTime = ({hours, minutes}) => `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`


    const setNowTime = () => {
        onChange((new Date().getHours()).toString().padStart(2,"0") + ":" + (new Date().getMinutes()).toString().padStart(2,"0"))
        setIsRequiredAlert(false)
    }
    requiredFieldRef.current = () => {
        if (required) {
            setIsRequiredAlert(true)
        } else {
            setIsRequiredAlert(false)
        }
      }
    return (
        <Layout>
            <View style={styles.text}>
                <Text style={styles.text} category={required ? "label" :"p2"}>
                    {title}
                </Text> 
                <Text status='danger'> 
                    {required ? "*": " "} 
                </Text>
            </View> 
            <Button disabled={disabled} onPress={()=>setShowPicker(true)} appearance='outline' style={styles.hour} size='large'>{hour}</Button>
            { isRequiredAlert ?
                <Layout size='small' style={styles.alert}>
                    <Icon status='danger' fill='#FF0000' name='alert-circle'style={styles.icon}/> 
                    <Text style={styles.alert} category="p2">
                        Por favor seleccione una hora
                    </Text>
                </Layout>
                :
                <></>
            }
            { disabled ? 
                <></> : 
                <Button style={styles.button} onPress={()=>setNowTime()}>{"Reset time"}</Button>
            }
            <TimerPickerModal
                visible={showPicker}
                setIsVisible={setShowPicker}
                onConfirm={(pickedDuration) => {
                    onChange(formatTime(pickedDuration))
                    setHour(formatTime(pickedDuration))
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
    },
    text: {
        marginHorizontal: '1%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'left',
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

export default HourSelector