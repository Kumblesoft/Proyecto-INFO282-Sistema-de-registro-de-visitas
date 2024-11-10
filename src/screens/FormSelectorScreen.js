import React, { useState } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import { Text, TopNavigation, TopNavigationAction, Divider, Layout, Icon } from '@ui-kitten/components'
import { useFormContext } from '../context/FormContext'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'

const FormSelectorScreen = ({ route }) => {
  const navigation = useNavigation()
  const { forms } = route.params
  const [localForms, setForms] = useState(forms)
  const { selectedForm, setSelectedForm } = useFormContext()

  const handleSelectForm = form => {
    setSelectedForm(form)
    navigation.navigate('Menu')
  }
  const [file, setFile] = useState(null)

  //File picker function
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true, // Enable caching for easier access
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0]
        setFile(pickedFile)

        console.log("File URI:", pickedFile.uri)
        console.log("File Name:", pickedFile.name)
        console.log("File Size:", pickedFile.size)
        console.log("MIME Type:", pickedFile.mimeType)

        // Copy the file to a cache directory
        const fileUri = pickedFile.uri
        const newPath = `${FileSystem.cacheDirectory}${pickedFile.name}`
        await FileSystem.copyAsync({
          from: fileUri,
          to: newPath,
        })

        // Now read the file from the cache
        const content = await FileSystem.readAsStringAsync(newPath)
        const new_forms = localForms.concat(JSON.parse(content))
        setForms(new_forms)

        // Write the forms.json with thw new forms
        fs.writeFile('../TestForms/forms.json', new_forms, 'utf8', (err) => {
          if (err) {
            console.error("Error writing to file:", err)
          }
          console.log("File content overwritten successfully!")
        })

      } else if (result.canceled) {
        console.log("Action Canceled, no file selected.")
      } else {
        Alert.alert("Error", "Failed to pick a document. Please try again.")
      }
    } catch (err) {
      console.log("Error picking document:", err)
      Alert.alert("Error", "Something went wrong when picking the document.")
    }
  }

  const backIcon = () => (
    <Icon
      name='arrow-ios-back-outline'
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
          data={localForms}
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
