import React, { useState } from "react"
import { ScrollView, View, StyleSheet, Alert, SafeAreaView } from "react-native"
import { Text, Input, Layout, Icon } from "@ui-kitten/components"
import { LinearGradient } from "expo-linear-gradient"
import { TopNavigation, TopNavigationAction, Divider } from "@ui-kitten/components"
import { useNavigation } from "@react-navigation/native"
import { useSQLiteContext } from "expo-sqlite"
import { getDatabaseInstance } from "../database/database"

import FieldSelector from "../components/FormGenerator/FieldSelector" 

export default function FormEditor() {
  const db = getDatabaseInstance(useSQLiteContext())
  const navigation = useNavigation()
  const [selectedField, setSelectedField] = useState("") // Estado para el FieldSelector
  const formNames = new Set(require("../TestForms/forms.json").map(form => form["nombre formulario"]))
  const [isNameTaken, setIsNameTaken] = useState(false)
  const [formName, setFormName] = useState("")

  const BackIcon = (props) => (
    <Icon
        name='arrow-ios-back-outline'
        style={styles.backIcon}
        fill='#fff'
        {...props}
    />
  )
  const BackAction = () => (
      <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
  )

  const renderTitle = () => (
      <View style={styles.titleContainer}>
          <Text style={styles.topNavigationText}>Creador de formularios</Text>
      </View>
  )

  const handleSaveForm = fields => {
    if (isNameTaken) {
      Alert.alert('Error', 'El nombre de la plantilla ya existe')
      return
    } else if (formName === "") {
      Alert.alert('Error', 'Ingrese un nombre para la plantilla')
      return
    } else if (fields.length === 0) {
      Alert.alert('Error', 'Agregue al menos un campo al formulario')
      return
    }  else if (fields.some(field => field.nombre === "")) {
      Alert.alert('Error', 'Ingrese un nombre para todos los campos')
      return
    }
    const newForm = {
      "nombre formulario": formName,
      "ultima modificacion": new Date().getTime(),
      campos: fields,
    }
    // Guardar el nuevo formulario en el archivo JSON
    db.addForm(newForm)
    // console.log(newForm)    
  }

  const checkFormName = name => {
    //console.log(name)
    //console.log(formNames)
    setIsNameTaken(formName != name && formNames.has(name))
    !isNameTaken ? setFormName(name) : setFormName("")
  }

  return (
    <Layout style={styles.layoutContainer}>
      <SafeAreaView style={styles.safeArea}>
        <Layout style={styles.backgroundPage}>
          <LinearGradient colors={['#2dafb9', '#17b2b6', '#00b4b2', '#00b7ad', '#00b9a7', '#00bba0', '#00bd98', '#00bf8f', '#00c185', '#00c27b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <TopNavigation
                    title={renderTitle}
                    style={styles.topNavigation}
                    accessoryLeft={BackAction}
                    alignment='center'
                />
            </LinearGradient>
            <Divider />
          <ScrollView style={styles.container} nestedScrollEnabled>
            <Layout style={styles.containerBox}>
              <Text style={styles.label}>Nombre del Formulario</Text>
              <Input placeholder="Nombre del Formulario" style={styles.input} textStyle={{ color: isNameTaken ? 'red' : 'black' }} onChangeText={checkFormName}/>
            </Layout>
            
            {isNameTaken && 
              <Layout size='small' style={styles.alert}>
                <Icon status='danger' fill='#FF0000' name='alert-circle' style={styles.icon} />
                <Text style={{ color: 'red' }}>Este nombre de plantilla ya existe</Text>
              </Layout>
            }
            
            {/* Campo Selector */}
            <FieldSelector
              selectedValue={selectedField}
              onValueChange={setSelectedField} // Actualiza el estado cuando cambia el selector
              onSave = {fields => handleSaveForm(fields)}
            />

            {/* Botón para guardar cambios <Button onPress={handleFieldPos} margin='20' padding='20' title="Guardar" /> */}
            
          </ScrollView>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#00baa4',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  backIcon: {
    width: 25,
    height: 25,
    paddingRight: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topNavigation: {
    backgroundColor: 'transparent',
  },
  topNavigationText:{
    marginRight: 0,
    fontSize: 24,   
    fontWeight: 'bold',
    color: '#fff',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    flex: 1,
    alignSelf: "flex-start",
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    flex: 1,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5
  },
  containerBox: {
    padding: "4%",
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingBottom: 0,
    alignItems: 'flex-start',
    height: 'auto',
    width: '100%',
  },
  optionContainer: {
    marginBottom: 10,
  },
  selectedFieldText: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: "bold",
  },
  icon: {
    width: 20,
    height: 20,
  },
  alert: {
    backgroundColor: 'transparent',
    flex: 1,
    margin: 1,
    marginHorizontal: '3%',
    color: '#dd0000',
    top: -10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  layoutContainer: {
    backgroundColor: '#fff',
    flex: 1
  },
  backgroundPage: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
})