import React, { useState } from "react"
import { ScrollView, View, StyleSheet } from "react-native"
import { Text, Input, Button, Layout } from "@ui-kitten/components"
import formTemplate from "../fieldsConstructor/fields.json" // Importar el JSON con los campos
import FieldSelector from "../components/FieldSelector" 

export default function FormEditor() {
  const [formFields, setFormFields] = useState(formTemplate)
  const [selectedField, setSelectedField] = useState("") // Estado para el FieldSelector
  const createdFields = []

  const handleFieldPos = (field) => {
    createdFields.push(field)
  }

  const handleFieldChange = (fieldKey, fieldProperty, value) => {
    setFormFields(prevFields => ({
      ...prevFields,
      [fieldKey]: {
        ...prevFields[fieldKey],
        [fieldProperty]: value,
      }
    }))
  }

  const renderField = (fieldKey, field) => {
    return (
      <Layout key={fieldKey} style={styles.fieldContainer}>
        <Text style={styles.label}>{field.nombre}</Text>
        {field.tipo === "texto" && (
          <Input
            style={styles.input}
            value={field.valor}
            OnChange={(text) => handleFieldChange(fieldKey, "valor", text)} // Cambiar el valor
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
      <Input placeholder="Nombre del Formulario" style={styles.input} />
      {/* Campo Selector */}
      <FieldSelector
        selectedValue={selectedField}
        onValueChange={(value) => setSelectedField(value)} // Actualiza el estado cuando cambia el selector
      />

      {/* Renderizar campos del formulario */}
      {selectedField && renderField(selectedField, formFields[selectedField])}

      {/* Botón para guardar cambios */}
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
    borderRadius: 5,
    marginBottom: 10,
  },
  optionContainer: {
    marginBottom: 10,
  },
  selectedFieldText: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: "bold",
  },
})