import React, { useContext, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, StatusBar, Alert } from "react-native";
import { Text, Layout } from "@ui-kitten/components";
import Svg, { Circle } from "react-native-svg";
import { useNavigation } from '@react-navigation/native';
import { useFormContext } from '../context/FormContext';
import { IdentifierContext } from '../context/IdentifierContext'; // Importa el contexto del identificador

const forms = require('../TestForms/forms.json');

export default function Menu() {
  const navigation = useNavigation();
  const { selectedForm } = useFormContext();
  const { identifier } = useContext(IdentifierContext); // Obtiene el identificador del contexto

  useEffect(() => {
    console.log("Identifier from context:", identifier); // Para verificar en consola
  }, [identifier]);

  const handleFormulariosPress = () => navigation.navigate('FormSelector', { forms });

  const handleRellenarPress = () => {
    selectedForm ?
      navigation.navigate('FormFiller', { form: selectedForm }) :
      Alert.alert('Error', 'Seleccione un formulario primero');
  };

  const handleSavedFormsPress = () => navigation.navigate('SavedForms');

  return (
    <Layout style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#3F704D" />
      <View style={styles.container}>
        <Svg height="70%" width="100%" style={styles.svgStyle}>
          <Circle cx="50%" cy="10%" r="80%" fill="#3F704D" />
        </Svg>

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
});
