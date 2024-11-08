import React, { useContext, useEffect } from "react"
import { StyleSheet, View, TouchableOpacity, StatusBar, Button, Alert } from "react-native"
import { Text, Layout, Icon, IconElement } from "@ui-kitten/components" 
import Svg, { Circle, Defs, Stop, LinearGradient as SvgLinearGradient } from "react-native-svg"
import { useNavigation } from '@react-navigation/native' 
import { useFormContext } from '../context/FormContext' // Importa el contexto


const forms = require('../TestForms/forms.json');

export default function Menu() {
  const navigation = useNavigation();
  const { selectedForm } = useFormContext();
  

  const handleFormulariosPress = () => navigation.navigate('FormSelector', { forms });

  const handleRellenarPress = () => {
    selectedForm ?
      navigation.navigate('FormFiller', { form: selectedForm }) :
      Alert.alert('Error', 'Seleccione un formulario primero');
  };

  const handleSavedFormsPress = () => navigation.navigate('SavedForms') // Nueva función para navegar a SavedForms

  const handleSettingsPress = () => navigation.navigate('Settings')

  return (
    <Layout style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#3F704D" />
      <View style={styles.container}>
        <Svg height="70%" width="100%" style={styles.svgStyle}>
        <Defs>
          <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#01a29d" stopOpacity="1" />
            <Stop offset="100%" stopColor="#9dfbad" stopOpacity="1" />
          </SvgLinearGradient>
        </Defs>
        <Circle cx="50%" cy="10%" r="80%" fill="url(#grad)" />
        </Svg>

        <TouchableOpacity style={styles.iconButton} onPress={handleSettingsPress}>
            <Icon name='settings-outline' style={{ width: 50, height: 50}} fill='#fff'/>
        </TouchableOpacity>


        <View style={styles.header}>
          <Text category="h1" style={styles.title}>Formulapp</Text>
          <Text category="s1" style={styles.subtitle}>
            {selectedForm ? selectedForm["nombre formulario"] : "Seleccione un formulario"}
          </Text>
          
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

        <View style={styles.footer}>
          <TouchableOpacity style={styles.buttonFormularios} onPress={handleSavedFormsPress}>
            <Text style={styles.buttonText}>Formularios Guardados</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E9EB"
  },
  iconButton: {
    position: 'absolute', // Permite posicionar el icono de forma absoluta
    top: 20, // Ajusta la distancia desde el borde superior
    right: 20, // Ajusta la distancia desde el borde derecho
    zIndex: 1, // Asegura que el icono esté en la parte superior
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
    color: "white",
    textShadowColor: "black",
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 0.2,
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
    borderColor: "#000",
    backgroundColor: "#5a6bf7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 15,
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
    backgroundColor: "#5a6bf7",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20
  }
});
