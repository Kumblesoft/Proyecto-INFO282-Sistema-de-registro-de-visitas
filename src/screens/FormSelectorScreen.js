import React from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Text } from '@ui-kitten/components'
import { useFormContext } from '../context/FormContext'
import { useNavigation } from '@react-navigation/native'

const FormSelectorScreen = ({ route }) => {
  const navigation = useNavigation()
  const { forms } = route.params
  const { selectedForm, setSelectedForm } = useFormContext()

  const handleSelectForm = form => {
    setSelectedForm(form)
    navigation.navigate('Menu')
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelectForm(item)}>
      <Text style={styles.itemText}>{item["nombre formulario"]}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={forms}
        renderItem={renderItem}
        keyExtractor={(item) => item["nombre formulario"]}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between', // Esto ayuda a distribuir el espacio entre la lista y el botón
  },
  listContainer: {
    paddingBottom: 60, // Espacio para el botón en la parte inferior
  },
  backButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  item: {
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
  },
})

export default FormSelectorScreen
