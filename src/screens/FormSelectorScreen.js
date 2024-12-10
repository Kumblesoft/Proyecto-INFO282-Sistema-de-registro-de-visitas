import React, { useState } from 'react'
import { Dimensions, Platform, View, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native'
import { ButtonGroup, Button, Text, TopNavigation, TopNavigationAction, Divider, Layout, Modal, Card, Icon } from '@ui-kitten/components'
import { useFormContext } from '../context/SelectedFormContext'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import * as Animatable from 'react-native-animatable'
import shareTypes from '../commonStructures/shareTypes'
import * as DocumentPicker from 'expo-document-picker'
import { useSQLiteContext } from 'expo-sqlite'
import Database from '../database/database'


const dbFormTest = require('../TestForms/dbFormTest.json')

const { width, height } = Dimensions.get('window')

const FormSelectorScreen = () => {
  const database = useSQLiteContext()
  const db = new Database(database)
  console.log(dbFormTest)
  db.addForm(dbFormTest)
  const navigation = useNavigation()
  const forms = require("../TestForms/forms.json")
  const [ localForms, setForms ] = useState(forms)
  const [isOptionModalVisible, setIsOptionModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState({ "nombre formulario": "err" })
  const { setSelectedForm } = useFormContext()
  const [ isSelectionMode, setIsSelectionMode ] = useState(false) // Modo de selección
  const [ selectedForms, setSelectedForms ] = useState([]) // Formularios seleccionados
  const [ file, setFile ] = useState(null) // File picker function

  const backIcon = () => <Icon name='arrow-ios-back-outline' fill='#fff' style={styles.topNavigationIcon}/>
  const importIcon = () => <Icon name='cloud-download-outline' fill='#fff' style={styles.topNavigationIcon}/>
  const deleteIcon = props => <Icon name='trash-outline' {...props} fill="#fff" animationConfig={{ cycles: Infinity }} animation='zoom' style={[props.style, { width: 30, height: 30 }]}/>
  const shareIcon = props => <Icon name='share-outline' {...props} fill="#fff" animationConfig={{ cycles: Infinity }} animation='zoom' style={[props.style, { width: 30, height: 30 }]}/>
  const plusIcon = props => <Icon name='plus-outline' {...props} fill="#fff" animationConfig={{ cycles: Infinity }} animation='zoom' style={[props.style, { width: 40, height: 40 }]}/>
  const BackAction = () => <TopNavigationAction icon={backIcon} onPress={() => navigation.goBack()} />
  const importAction = () => <TopNavigationAction icon={importIcon} onPress={() => pickDocument()} />
  const optionBar = () => (
    <Layout style={styles.iconContainer}>
      <TopNavigationAction icon={SelectionIcon} onPress={toggleSelectionMode} />
      <TopNavigationAction icon={importIcon} onPress={() => pickDocument()} />
    </Layout>
  )


  //File picker function
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true // Enable caching for easier access
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

        const content = await FileSystem.readAsStringAsync(newPath) // Now read the file from the cache
        // console.log("File Content:", content) // Log the content (JSON)
        const tempo = localForms.concat(JSON.parse(content))
        setForms(tempo)

        console.log(tempo, '\n')

        try {
          // Write new content to the file (overwrites existing content)
          await FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}forms.json`, JSON.stringify(tempo))
          Alert.alert("Success", "File content has been overwritten!")
        } catch (err) {
          console.error("Error writing to file:", err)
          Alert.alert("Error", "Failed to overwrite the file.")
        }

        console.log(localForms)
      }
      else if (result.canceled) { console.log("Action Canceled, no file selected.") }
      else { Alert.alert("Error", "Failed to pick a document. Please try again.") }
    } catch (err) {
      console.log("Error picking document:", err)
      Alert.alert("Error", "Something went wrong when picking the document.")
    }
  }

  const deleteSelectedForms = async () => {
    try {
      const updatedForms = localForms.filter(form => !selectedForms.includes(form["nombre formulario"]))

      const filePath = `${FileSystem.cacheDirectory}forms.json`
      const updatedFormsString = JSON.stringify(updatedForms)

      await FileSystem.writeAsStringAsync(filePath, updatedFormsString)



      const newContent = await FileSystem.readAsStringAsync(filePath)
      const loc = localForms.pop(JSON.parse(newContent))

      setForms(loc)
      setSelectedForms([])
      setIsSelectionMode(false)
      console.log(localForms)
      console.log("Formularios restantes después de la eliminación:", updatedForms)
      console.log("Archivo actualizado guardado en:", filePath)

    } catch (error) {
        
        Alert.alert("Error", "Debe seleccionar uno o varios formularios para eliminarlos")
    }
  }

  const SelectionIcon = (props) => (
    <Icon name={isSelectionMode ? 'checkmark-square' : 'checkmark-square'} style={styles.backIcon} fill='#fff' {...props} />
  )

  const SelectionAction = () => (
    <TopNavigationAction icon={SelectionIcon} onPress={toggleSelectionMode} />
  )

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode)
    setSelectedForms([]) // Resetear selección al activar/desactivar modo
  }

  const handleSelection = item => {
    if (isSelectionMode) {
      setSelectedForms((prev) =>
        prev.includes(item["nombre formulario"])
          ? prev.filter((id) => id !== item["nombre formulario"])
          : [...prev, item["nombre formulario"]]
      )
    }
  }

  const handlePress = form => {
    if (isSelectionMode) {
      handleSelection(form)
    }
    else {
      setSelectedForm(form)
      navigation.navigate('Menu')
    }
  }

  const renderTitle = () => (
    <View style={styles.titleContainer}>
      <Text style={styles.topNavigationText}>Selector de formularios</Text>
    </View>
  )



  const renderItem = ({ item }) => (

    <TouchableOpacity
      style={[styles.containerBox, selectedForms.includes(item["nombre formulario"]) && styles.selectedItem]}
      onPress={() => handlePress(item)}
      onLongPress={toggleSelectionMode}
    >
      <Text style={styles.itemText}>{item["nombre formulario"]}</Text>
      <Button
        accessoryLeft={
          <Icon name='menu-outline' style={{ width: 25, height: 25 }} fill='#000' />
        }
        onPress={() => {
          setSelectedItem(item)
          setIsOptionModalVisible(true)
        }}
        appearance="ghost"
        style={styles.optionsButton}
      />
    </TouchableOpacity>
  )

  const shareFormTemplate = formItems => {
    if (!formItems) return Alert.alert('Error', 'No se ha seleccionado un formulario')
    if (formItems.constructor === Array) {
      const formItemsSet = new Set(formItems)
      formItems = forms.filter(form => formItemsSet.has(form["nombre formulario"]))
    }

    const typeOfMedia = formItems.constructor === Array ? shareTypes.MULTIPLE_FORMS : shareTypes.SINGLE_FORM

    const objectStringified = JSON.stringify({
      share_content_type: typeOfMedia,
      content: formItems
    })
    // Intentar compartir usando un archivo temporal
    const filePath = `${FileSystem.cacheDirectory}plantillaFormulario.json`
    FileSystem.writeAsStringAsync(filePath, objectStringified).then(
      () => Sharing.shareAsync(filePath, {
        dialogTitle: 'Compartir JSON como archivo',
        mimeType: 'application/json',
        UTI: 'public.json'
      })
      // Si se compartio correctamente
    ).catch(error => {
      console.error('Error al crear archivo:', error)
      Alert.alert('Error', 'Hubo un problema al intentar compartir el archivo')
      // Borrar el archivo temporal
    }).finally(
      async () => {
        try {
          const fileInfo = await FileSystem.getInfoAsync(filePath)
          if (fileInfo.exists) await FileSystem.deleteAsync(filePath)
        } catch (deleteError) {
          console.error('Error al eliminar el archivo:', deleteError)
        }
      }
    )
  }

  const OptionsModal = () => {

    const onShare = shareFormTemplate
    const onEdit = () => console.log("Editar")
    const onSelect = item => {
      setSelectedForm(item)
      navigation.goBack()
    }
    const onView = () => {
      setIsOptionModalVisible(false)
      navigation.navigate('FormFiller', { form: selectedItem, disabledSave: true })
    }

    return (
      <Modal
        visible={isOptionModalVisible}
        backdropStyle={newModalStyles.backdrop}
        onBackdropPress={() => setIsOptionModalVisible(false)}
      >

        <Animatable.View
          animation="fadeIn"
          duration={300}
        >
          <Card disabled={true} style={newModalStyles.container}>
            <Text style={newModalStyles.title}>{selectedItem["nombre formulario"]}</Text>

            <View style={newModalStyles.buttonGroup}>
              <Button
                accessoryLeft={() => (
                  <Image source={require('../assets/view.png')} style={newModalStyles.icon} />
                )}
                onPress={() => onView(selectedItem)}
                style={newModalStyles.actionButton}
              />
              <Button
                accessoryLeft={() => (
                  <Image source={require('../assets/share.png')} style={newModalStyles.icon} />
                )}
                onPress={() => onShare(selectedItem)}
                style={newModalStyles.actionButton}
              />
              <Button
                accessoryLeft={() => (
                  <Image source={require('../assets/edit.png')} style={newModalStyles.icon} />
                )}
                onPress={() => onEdit(selectedItem)}
                style={newModalStyles.actionButton}
              />
            </View>

            <Button
              onPress={() => onSelect(selectedItem)}
              style={newModalStyles.selectButton}
              textStyle={newModalStyles.buttonText}
              status='info'
            >
              {"Seleccionar"}
            </Button>
            <Button
              onPress={() => setIsOptionModalVisible(false)}
              style={newModalStyles.closeButton}
              textStyle={newModalStyles.buttonText}
              status='danger'
            >
              {"Cerrar"}
            </Button>
          </Card>
        </Animatable.View>
      </Modal>
    )
  }

  return (
    <>
      
      {OptionsModal()}
      <Layout style={styles.layoutContainer}>
        <SafeAreaView style={styles.safeArea}>
          <LinearGradient colors={['#2dafb9', '#17b2b6', '#00b4b2', '#00b7ad', '#00b9a7', '#00bba0', '#00bd98', '#00bf8f', '#00c185', '#00c27b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <TopNavigation
              title={renderTitle}
              style={styles.topNavigation}
              accessoryLeft={BackAction}
              accessoryRight={optionBar}
              alignment='center'
            />
          </LinearGradient>
        </SafeAreaView>
        <Divider />
        <Layout style={styles.container}>
          <FlatList
            data={forms.filter((form) => form !== null)}
            renderItem={renderItem}
            keyExtractor={(item) => item["nombre formulario"]}
            contentContainerStyle={styles.listContainer}
          />    
        </Layout>
      </Layout>
        <View style={styles.containerMenuBar}>

          <Button style={styles.iconButton2} appearance="ghost" onPress={() => deleteSelectedForms()} accessoryLeft={deleteIcon} />

          <Button style={styles.centerButton} onPress={() => navigation.navigate('Menu')} accessoryLeft={plusIcon} />
          
          <Button style={styles.iconButton2} appearance="ghost" accessoryLeft={shareIcon} />
        </View>
      
    </>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#00baa4'
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    justifyContent: 'space-between', // Esto ayuda a distribuir el espacio entre la lista y el botón
  },
  listContainer: {
    paddingBottom: 60, // Espacio para el botón en la parte inferior
    backgroundColor: 'transparent',
  },

  backButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  volverButton: {
    padding: 10,
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
    fontWeight: 'bold',
  },
  optionsButton: {
    margin: 2,
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontWeight: 'bold',
    fontSize: 10,
  },
  topNavigation: {
    backgroundColor: "transparent",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  selectedItem: {
    backgroundColor: '#BBDEFB',
    borderColor: '#79b2fc',
  },
  containerBox: {
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#00b7ae',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Platform.OS == "ios" ? 1 : 10 },
    shadowOpacity: Platform.OS == "ios" ? 0.3 : 0.9,
    shadowRadius: Platform.OS == "ios" ? 3 : 2,
    elevation: 3,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 'auto'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  topNavigationText:{
    marginRight: Platform.OS == "ios" ? 50 : 50,
    fontSize: Platform.OS == "ios" ? 22: 22,   
    fontWeight: 'bold',
    color: '#fff',
  },
  topNavigationIcon: {
    width: 25,
    height: 25,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 1000,
    position: 'absolute',
    bottom: width * 0.05,
  },
  layoutContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  formOptionBar: {
    flexDirection: 'row', // Organiza los botones en una fila horizontal
    justifyContent: 'space-between', // Distribuye los botones uniformemente
    alignItems: 'center', // Centra verticalmente los botones
    bottom: 0,
    backgroundColor: 'black', // Color de fondo de la barras de opciones
  },
  deleteButton: {
    marginLeft: "2%",
    borderRadius: 5,
  },
  shareButton: {
    marginRight: "2%",
    borderRadius: 5,
  },
  shareIcon: {
    width: 20,
    height: 20,
  },

  floatingButtonContainer: {
    position: 'absolute',
    bottom: height * 0.05, // Distancia desde la parte inferior
    right: width * 0.2,  // Distancia desde el lado derecho
    zIndex: 1000, // Asegura que esté encima de otros elementos
  },
  createButton: {
    width: width * 0.15,  // Ajusta el tamaño según tus necesidades
    height: width * 0.15,
    borderRadius: (width * 0.15)/2, // Hace el botón circular
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  containerMenuBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#00baa2', 
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    position: 'relative',
  },
  iconButton2: {
    flex: 1,
    alignItems: 'center',
    
  },
  centerButtonContainer: {
    position: 'absolute',
    top: -30, // Elevar el botón
    alignSelf: 'center',
    marginTop: width * 0.9 
  },
  centerButton: {
    top: -25,
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: '#00e895', 
    borderColor: '#fff', 
    borderWidth: 6,
  },
})

const newModalStyles = StyleSheet.create({
  scrollContainer: {
    width: '100%', // Asegura que el ScrollView ocupe todo el ancho del Card
    flexGrow: 1, // Permite que el ScrollView crezca si es necesario
  },
  backdrop: {
    backgroundColor: 'rgba(30, 30, 0, 0.7)', // Fondo oscuro semitransparente para enfoque
  },
  container: {
    padding: 25,
    borderRadius: 15,
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  actionButton: {
    backgroundColor: '#F0F0F0', // Color de fondo moderno para botones de acción
    borderRadius: 10,
    paddingVertical: 12,
    width: '30%', // Cada botón ocupa el 30% del ancho del grupo
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#6E6E6E', // Color sutil y moderno para iconos
  },
  selectButton: {
    borderRadius: 5,
    paddingVertical: 12,
    alignSelf: 'center',
    justifyContent: 'center', // Centrado vertical en el contenedor del botón
    marginVertical: 8,
  },
  closeButton: {
    borderRadius: 5,
    paddingVertical: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  buttonText: {
    textAlign: 'center', // Centrado horizontal
    textAlignVertical: 'center', // Centrado vertical en Android
    color: '#FFFFFF', // Color de texto
    fontWeight: '600',
    fontSize: 16,
    flex: 1, // Asegura que el texto ocupe todo el espacio disponible en el botón
  }
})

export default FormSelectorScreen
