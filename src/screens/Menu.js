import React from "react"
import { StyleSheet, View, TouchableOpacity, StatusBar } from "react-native"
import { Text, Layout } from "@ui-kitten/components" 
import Svg, { Circle } from "react-native-svg"
import { useNavigation } from '@react-navigation/native' 
import { useFormContext } from '../context/FormContext' // Importa el contexto

const forms = require('../TestForms/forms.json')

export default function Menu() {
  const navigation = useNavigation()
  const { selectedForm } = useFormContext() // Usa el contexto

  const handleFormulariosPress = () => navigation.navigate('FormSelector', { forms }) // Solo pasar forms

  const handleRellenarPress = () => {
    if (selectedForm) {
      navigation.navigate('FormFiller', { form: selectedForm });
    } 
    else {
      console.log("No se ha seleccionado ningún formulario");
    }
  };
  /*const handleRellenarPress = () => {
    selectedForm ?
      console.log("Formulario seleccionado:", selectedForm) :
      console.log("No se ha seleccionado ningún formulario")
      navigation.navigate('FormFiller', { formData: forms })
  }*/

  return (
    <Layout style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#3F704D" />
      <View style={styles.container}>
        <Svg height="70%" width="100%" style={styles.svgStyle}>
          <Circle cx="50%" cy="10%" r="80%" fill="#3F704D" />
        </Svg>

        <View style={styles.header}>
          <Text category="h1" style={styles.title}>Formulapp</Text>
          <Text category="s1" style={styles.subtitle}>{ selectedForm ? selectedForm["nombre formulario"] : "Seleccione un formulario"}</Text>
        </View>

        <View style={styles.center}>
          <Svg height="200" width="200" style={styles.circleOverlay}>
            <Circle cx="100" cy="100" r="100" fill="#E8E9EB" />
          </Svg>
          <TouchableOpacity style={styles.buttonRellenar} onPress={handleRellenarPress}>
            <Text style={styles.buttonText}>Rellenar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.buttonFormularios} onPress={handleFormulariosPress}>
            <Text style={styles.buttonText}>Formularios</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  )
}

// Mantén los estilos como estaban...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E9EB"
  },
  svgStyle: {
    position: "absolute",
    top: 0,
    left: 0
  },
  header: {
    alignItems: "center",
    marginTop: 100
  },
  title: {
    fontWeight: "bold",
    color: "white"
  },
  subtitle: {
    color: "white",
    marginTop: 10
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  circleOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -100 }, { translateY: -100 }]
  },
  buttonRellenar: {
    width: 170,
    height: 170,
    borderRadius: 95,
    backgroundColor: "#707EF6",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 2
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20
  },
  footer: {
    alignItems: "center",
    marginBottom: 50
  },
  buttonFormularios: {
    backgroundColor: "#707EF6",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20
  }
})
