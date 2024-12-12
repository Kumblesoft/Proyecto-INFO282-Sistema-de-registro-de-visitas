import React, { useState } from "react"
import { ScrollView, View, StyleSheet, SafeAreaView, Platform } from "react-native"
import { Text, Input, Layout, Icon, Buttonr } from "@ui-kitten/components"
import { LinearGradient } from "expo-linear-gradient"
import { TopNavigation, TopNavigationAction, Divider } from "@ui-kitten/components"
import { useNavigation } from "@react-navigation/native"

import formTemplate from "../fieldsConstructor/fields.json" // Importar el JSON con los campos
import FieldSelector from "../components/FieldSelector" 

export default function FormEditor() {
  const navigation = useNavigation()
  const [formFields, setFormFields] = useState(formTemplate)
  const [selectedField, setSelectedField] = useState("") // Estado para el FieldSelector
  const createdFields = [] 
  const formNames = new Set(require("../TestForms/forms.json").map(form => form["nombre formulario"]))
  const [isNameTaken, setIsNameTaken] = useState(false)

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

  const handleFieldChange = (fieldKey, fieldProperty, value) => {
    setFormFields(prevFields => ({
      ...prevFields,
      [fieldKey]: {
        ...prevFields[fieldKey],
        [fieldProperty]: value,
      }
    }))
  }

  const checkFormName = name => {
    console.log(name)
    console.log(formNames)
    setIsNameTaken(formNames.has(name))
    console.log(formNames.has(name))
  }
  const renderField = (fieldKey, field) => {
    return (
      <Layout key={fieldKey} style={styles.fieldContainer}>
        <Text style={styles.label}>{field.nombre}</Text>
        {field.tipo === "texto" && (
          <Input
            style={styles.input}
            value={field.valor}
            onChangeText={text => handleFieldChange(fieldKey, "valor", text)} // Cambiar el valor
            placeholder={`Ingrese ${field.nombre}`}
          />
        )}
        {/* Añadir más tipos de campos si es necesario */}
        {/* Si el campo tiene opciones, se pueden mostrar aquí */}
        {field.opciones && (
          <View style={styles.optionContainer}>
            <Text>Opciones:</Text>
            {field.opciones.map((option, index) => (
              <Text key={index}>{option.nombre}</Text>
            ))}
          </View>
        )}
      </Layout>
    )
  }

  return (
    <>
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
      <Divider/>
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
      />

      {/* Renderizar campos del formulario */}
      {selectedField && renderField(selectedField, formFields[selectedField])}

      {/* Botón para guardar cambios <Button onPress={handleFieldPos} margin='20' padding='20' title="Guardar" /> */}
      
    </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
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
  containerBox: {
    padding: "4%",
    marginBottom: "0%",
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderStartColor: 'transparent',
    borderEndColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: '#00b7ae',
    alignItems: 'flex-start',
    height: 'auto',
    width: '100%',
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
})