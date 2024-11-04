import React, { useState } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import { Text, TopNavigation, TopNavigationAction, Divider, Layout, Icon } from '@ui-kitten/components'
import { useFormContext } from '../context/FormContext'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import * as DocumentPicker from 'expo-document-picker'

const FormSelectorScreen = ({ route }) => {
  const navigation = useNavigation()
  const { forms } = route.params
  const { selectedForm, setSelectedForm } = useFormContext()

  const handleSelectForm = form => {
    setSelectedForm(form)
    navigation.navigate('Menu')
  }
  //File picker function
  const [file, setFile] = useState(null)

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // You can specify a file type here if you want (e.g., "application/pdf" for PDFs)
        copyToCacheDirectory: true // Copies the file to cache directory so you can read it later
      })

      if (result.type === "success") {
        setFile(result)
        console.log("File URI:", result.uri)
        console.log("File Name:", result.name)
        console.log("File Size:", result.size)
        console.log("MIME Type:", result.mimeType)
      }
    } catch (err) {
      console.log("Error picking document:", err)
    }
  }

  const backIcon = () => (
    <Image
      source={require('../assets/arrow_back.png')}
      style={styles.topNavigationIcon}
    />
  )
  const importIcon = () => (
    <Icon
      name='cloud-download-outline'
      style={styles.topNavigationIcon}
    />
  )

  const backAction = () => (
    <TopNavigationAction icon={backIcon} onPress={() => navigation.goBack()} />
  )
  const importAction = () => (
    <TopNavigationAction icon={importIcon} onPress={() => pickDocument()} />
  )

  const renderTitle = () => (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>Selector de formularios</Text>
    </View>
  )
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.containerBox} onPress={() => handleSelectForm(item)}>
      <Text style={styles.itemText}>{item["nombre formulario"]}</Text>
    </TouchableOpacity>
  )

  return (
    <>
      <LinearGradient colors={['#29C9A2', '#A0ECA5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <TopNavigation
          title={renderTitle}
          style={styles.topNavigation}
          accessoryLeft={backAction}
          accessoryRight={importAction}
          alignment='center'
        />
      </LinearGradient>
      <Divider />
      <Layout style={styles.container}>
        <FlatList
          data={forms}
          renderItem={renderItem}
          keyExtractor={(item) => item["nombre formulario"]}
          contentContainerStyle={styles.listContainer}
        />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </Layout>
    </>
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
    borderRadius: 10,
  },
  itemText: {
    fontSize: 20,
  },
  topNavigation: {
    backgroundColor: "transparent",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerBox: {
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#9beba5',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 3,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 'auto'
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
  },
  topNavigationIcon: {
    width: 25,
    height: 25,
  },
})

export default FormSelectorScreen
