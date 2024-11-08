import React, { useState, useEffect } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Platform,TouchableOpacity, Modal, SafeAreaView, StatusBar } from 'react-native'
import { Text, Input, Button, Layout, ViewPager, Icon } from '@ui-kitten/components'
import { Err, Ok } from '../commonStructures/resultEnum'
import { useCameraPermissions } from 'expo-camera';
import { CameraView } from "expo-camera";

/**
 * Represents optional features for the TextEntry component.
 * 
 * @param {Object} options - Options for configuring the TextEntry component.
 * @param {string} [options.title] - The title displayed above the input field.
 * @param {boolean} [options.required=false] - Indicates if the field is required.
 * @param {Array<string>} [options.limitations=[]] - An array of limitations for the input value.
 *        Example: ["solo letras"] to restrict input to letters only.
 * @param {string} [options.variableName] - "Salida", used to diferentiate different fields with same title
 * @param {Array<string>} [options.format=[]] - An array of conditions to format the input value.
 * @param {boolean} [options.QRfield = false] - Indicates if the field can be filled by QR
 *  @returns {Object} An object containing the defined optional features.
 */
export const OptionalTextFeatures = (options = {}) => {
  return {
    title: options.title ?? "",
    required: options.required ?? false,
    limitations: options.limitations ?? [], 
    format: options.format ?? [],
    QRfield: options.QRfield ?? false,
    variableName: options.variableName ?? ""
  }
}

/**
 * Map that defines the validator functions and behaviour of each limitation 
 */
const limitationBehaviour = new Map([
  ["solo letras", {
    regex: ((/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)),
    keyboardType: "default"
  }], 
  ["no numeros", {
    regex: /^[^\d]*$/,
    keyboardType: "default"
  }],
  ["solo numeros", {
    regex: /^-?\d+([.,]\d+)?$/,
    keyboardType: "numeric"
  }],
  ["solo enteros", {
    regex: /^-?\d+$/,
    keyboardType: "numeric"
  }],
  ["solo enteros positivos y cero", {
    regex: /^\d+$/,
    keyboardType: "numeric"
  }],
  ["email", {
    regex: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    keyboardType: "default"
  }]
])

/**
 * Debug version of get method for limitationBehaviour
 * @param {string} name 
 * @returns 
 */
limitationBehaviour.dGet = function (name) {
  const exists = this.has(name)
  if (!exists) {
    console.log(`No se encontro (${name}) en limitationBehaviour`)
    return {regex:/$/, keyboardType:"default"}
  }
  return this.get(name)
}

/**
 * Map that defines transformation functions as formatting for the fields
 */
const formatMap = new Map([
  ["solo mayusculas", input => input.toUpperCase()],
  ["solo minusculas", input => input.toUpperCase()]
])


/**
 * A component for text entry that allows users to input text with optional validation.
 *
 * @param {Object} props - Props for the TextEntry component.
 * @param {Object} props.optionalFeatures - Configuration options for the TextEntry.
 * @param {Function} props.onSelect - Callback function called when the input value changes.
 * @returns {JSX.Element} The rendered TextEntry component.
 */
const TextEntry = ({ optionalFeatures, onSelect, requiredFieldRef, refreshFieldRef}) => {
  const { title, required, limitations, format, QRfield} = optionalFeatures
  const [ inputValue, setInputValue ] = useState('')
  const [ invalidLimitations, setInvalidLimitations ] = useState([])
  const [ isRequiredAlert, setIsRequiredAlert] = useState(false)
  const [permission, requestPermission] = useCameraPermissions()
  const [isScanning, setIsScanning] = useState(false)

  const isPermissionGranted = Boolean(permission?.granted)

  useEffect(() => {
    if (QRfield && !isPermissionGranted) {
      requestPermission()
    }
  }, [QRfield, isPermissionGranted])


  /**
   * Handles changes to the input field and validates the input against specified limitations.
   *
   * @param {string} text - The new input value.
   */

  const handleChange = text => {
    
    // Limitations
    setInvalidLimitations(!text.length ? [] : limitations.reduce(
      (acc, limName) => {
      const limitationOk = limitationBehaviour.get(limName).regex.test(text)
      console.log(limitationOk,  limitationBehaviour.get(limName).regex, text)
      if (!limitationOk) {
        const limitationName = String.fromCharCode(limName.charCodeAt(0) - 32) + limName.substr(1)
        acc.push(limitationName) 
      }
      
    return acc}, []))

    console.log(invalidLimitations)

    if (invalidLimitations.length) {
      setInputValue(text)
      setIsRequiredAlert(false)
      if (onSelect) onSelect('') 
      return new Err("No cumple las limitaciones")
    }
    // Formatting
    format.forEach(formattingOption => text = formatMap.get(formattingOption)(text))
    if (onSelect) onSelect(text) 
    setInputValue(text)
    setIsRequiredAlert(false) 
    return new Ok("Correct input")
  }


    // Cambiar el estilo
    requiredFieldRef.current = () => {
      if (required && !inputValue) {
        setIsRequiredAlert(true)
      } else {
        setIsRequiredAlert(false)
      }
    }
    refreshFieldRef.current = () => {
      setInputValue('')
    }

    const handleBarCodeScanned = ({ data }) => {
      handleChange(data);  // Llama a handleChange con el valor escaneado para validación y formato
      setIsScanning(false); // Cierra el escáner después de escanear
    };

    const handleBarCodeScanned = ({ data }) => {
      handleChange(data);  // Llama a handleChange con el valor escaneado para validación y formato
      setIsScanning(false); // Cierra el escáner después de escanear
    };

  return (
    <Layout style={styles.containerBox}>
      {title && (
      <View style={styles.text}>
          <Text style={styles.text} category={required ? "label" :"p2"}>
            {title}
          </Text> 
          <Text status='danger'> 
            {required ? "*": " "} 
          </Text>
      </View>
      )}
      { invalidLimitations.length ? invalidLimitations.map((name, i) => <Text  key={i} style={{ color: 'red' }}> -{name} </Text>) : <></>}

      <Input 
        style={[styles.input, isRequiredAlert && { borderColor: '#ff0000' },QRfield && {flex :0.95},]} 
        value={inputValue} 
        onChangeText={handleChange} 
        keyboardType={limitations ? limitationBehaviour.dGet(limitations.at(0)).keyboardType : "default"}/>
        {QRfield && (
          <TouchableOpacity style={styles.qrButton} onPress={() => setIsScanning(true)}>
            <Icon name="camera-outline" fill="#000" style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        )}
      { isRequiredAlert ?
        <Layout size='small' style={styles.alert}>
          <Icon status='danger' fill='#FF0000' name='alert-circle'style={styles.icon}/> 
          <Text style={styles.alert} category="p2">
            Por favor rellene este campo
          </Text>
        </Layout>
        :
        <></>
      }
      {isScanning && (
        <Modal visible={isScanning} animationType="slide">
          <SafeAreaView style={styles.cameraContainer}>
            {Platform.OS === "android" ? <StatusBar hidden /> : null}
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: ['qr']
                }}
                onBarcodeScanned={handleBarCodeScanned} // Usa la función de escaneo aquí
            />
            <Button title="Cerrar Escáner" onPress={() => setIsScanning(false)} />
          </SafeAreaView>
        </Modal>
      )}
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
    flexWrap:'wrap',
    justifyContent: 'left',
  },
  label: {
    fontSize: 10,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  text: {
    marginHorizontal: '2%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  alert: {
    flex: 1,
    margin: 1,
    marginHorizontal: '3%',
    color: '#ff0000',
    top: -10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  icon: {
    width: 20,
    height: 20,
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 2,    
    borderBottomColor: '#000',
    backgroundColor: 'transparent',
    borderRadius: 5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    fontSize: 15,
    alignSelf: 'flex-start',
  },
  containerBox: {
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#ffffff', // Color fondo suave
    borderWidth: 1,
    borderColor: '#9beba5',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 3,
    alignItems: 'flex-start'
  },
  qrButton: { 
    marginLeft: 5, 
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default TextEntry