import React, { useState } from "react"
import { ScrollView, View, StyleSheet } from "react-native"
import { Text, Input, Layout, Icon, Button } from "@ui-kitten/components"
import formTemplate from "../fieldsConstructor/fields.json" // Importar el JSON con los campos
import FieldSelector from "../components/FieldSelector" 

export default function FormEditor() {
  const [formFields, setFormFields] = useState(formTemplate)
  const [selectedField, setSelectedField] = useState("") // Estado para el FieldSelector
  const createdFields = [] 
  const formNames = new Set(require("../TestForms/forms.json").map(form => form["nombre formulario"]))
  const [isNameTaken, setIsNameTaken] = useState(false)

  const handleFieldPos = createdFields.push

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
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nombre del Formulario</Text>
      <Input placeholder="Nombre del Formulario" style={styles.input} textStyle={{ color: isNameTaken ? 'red' : 'black' }} onChangeText={checkFormName}/>
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
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
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