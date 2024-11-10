import React, { useState } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native'
import { Button, Text, TopNavigation, TopNavigationAction, Divider, Layout, Modal, Card, Icon } from '@ui-kitten/components'
import { useFormContext } from '../context/FormContext'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import * as Animatable from 'react-native-animatable'
import shareTypes from '../commonStructures/shareTypes'
import * as DocumentPicker from 'expo-document-picker'
import { Ok } from '../commonStructures/resultEnum'


const FormSelectorScreen = () => {
  const navigation = useNavigation()
  const forms = require("../TestForms/forms.json")
  const [localForms, setForms] = useState(forms)
  const [ isOptionModalVisible, setIsOptionModalVisible ] = useState(false)
  const [ selectedItem, setSelectedItem ] = useState({"nombre formulario": "err"})
  const { setSelectedForm } = useFormContext()
  const [isSelectionMode, setIsSelectionMode] = useState(false) // Modo de selección
  const [selectedForms, setSelectedForms] = useState([]) // Formularios seleccionados
  const [file, setFile] = useState(null) // File picker function

  const backIcon = () => <Icon name='arrow-ios-back-outline' style={styles.topNavigationIcon}/>
  const importIcon = () => <Icon name='cloud-download-outline' style={styles.topNavigationIcon}/>
  const deleteIcon = props => <Icon name='trash' {...props} />
  const shareIcon = props => <Icon name='share' {...props}/>
  const BackAction = () => <TopNavigationAction icon={backIcon} onPress={() => navigation.goBack()} />
  const importAction = () => <TopNavigationAction icon={importIcon} onPress={() => pickDocument()} />
  

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
    const updatedForms = forms.filter(form => !selectedForms.includes(form["nombre formulario"]))
    setForms(updatedForms)
    setSelectedForms([])
    setIsSelectionMode(false)
    console.log("Formularios restantes después de la eliminación:", updatedForms)
  }

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode)
    setSelectedForms([]) // Resetear selección al activar/desactivar modo
  }

  const handleSelection = item => {
    if (!isSelectionMode) return Ok()
    setSelectedForms(prev =>
        prev.includes(item["nombre formulario"]) ?
            prev.filter((id) => id !== item["nombre formulario"]) :
            [...prev, item["nombre formulario"]]
    )
  }

  const renderTitle = () => (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>Selector de formularios</Text>
    </View>
  )

  const renderItem = ({ item }) => (

    <TouchableOpacity 
      style={styles.textContainer} 
      onPress={() => {
        if (isSelectionMode) return handleSelection(item)
        setSelectedForm(item)
        navigation.goBack()
      }} 
      onLongPress={toggleSelectionMode}
    >
      <View style={styles.containerBox}>
        <Text style={styles.itemText}>{item["nombre formulario"]}</Text>
        <Button
          accessoryLeft={() => (
            <Image source={require('../assets/options.png')} style={styles.shareIcon} />
          )}
          onPress={() => {
            setSelectedItem(item)
            setIsOptionModalVisible(true)
          }}
          appearance="ghost"
          style={styles.shareButton}
        />
      </View>
      
    </TouchableOpacity>
  )

  const shareFormTemplate = form => {
      const filePath = `${FileSystem.cacheDirectory}plantillaFormulario.json`
      const objectStringified = JSON.stringify({ 
        share_content_type: shareTypes.SINGLE_FORM,
        content           : form 
      })
      
      // Intentar compartir usando un archivo temporal
      FileSystem.writeAsStringAsync(filePath, objectStringified).then( 
        () => Sharing.shareAsync(filePath, 
          {
            dialogTitle : 'Compartir JSON como archivo',
            mimeType    : 'application/json',
            UTI         : 'public.json'
          }
        )
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
            >
              {"Seleccionar"}
            </Button>
            <Button
              onPress={() => setIsOptionModalVisible(false)}
              style={newModalStyles.closeButton}
              textStyle={newModalStyles.buttonText}
            >
              {"Cerrar"}
            </Button>
          </Card>
        </Animatable.View>
      </Modal>
  )}

  return (
    <>
      {OptionsModal()}
        <LinearGradient colors={['#2dafb9', '#17b2b6', '#00b4b2', '#00b7ad', '#00b9a7', '#00bba0', '#00bd98', '#00bf8f', '#00c185', '#00c27b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <TopNavigation
            title={renderTitle}
            style={styles.topNavigation}
            accessoryLeft={BackAction}
            accessoryRight={importAction}
            alignment='center'
          />
        </LinearGradient>
        <Divider />
        <Layout style={styles.container}>
          <FlatList
            data={forms}
            renderItem={renderItem}
            keyExtractor={item => item["nombre formulario"]}
            contentContainerStyle={styles.listContainer}
          />
            { 
              isSelectionMode && 
              (
                <Layout style={styles.buttonContainer}>
                    <Button
                        style={styles.deleteButton}
                        onPress={() => deleteSelectedForms()} // Pasamos los datos al botón
                        accessoryLeft={deleteIcon}
                    >
                        Eliminar 
                    </Button>

                    <Button status='info' style={styles.shareButton} accessoryLeft={shareIcon}>
                        Compartir
                    </Button>
                </Layout>
              )
            }
        <View style={styles.footerContainer}>
          <Button style={styles.backButton} onPress={() => navigation.goBack()}>
            Volver
          </Button>
        </View>
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
    fontSize: 22,   
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
  },
  deleteButton: {
    width: '35%',
    marginRight: '3%'
  },
  shareButton: {
    width: '35%',
    marginLeft: '3%'
  },  
  shareIcon: {
    width: 20,
    height: 20,
  },
  footerContainer: {
    padding: 10,
    backgroundColor: '#fff', // Color de fondo del pie de página
    alignItems: 'center', // Centrar el botón
    borderTopWidth: 1, // Línea superior (opcional)
    borderTopColor: '#ccc', // Color de la línea
  }
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
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    paddingVertical: 12,
    alignSelf: 'center',
    justifyContent: 'center', // Centrado vertical en el contenedor del botón
    marginVertical: 8,
  },
  closeButton: {
    backgroundColor: '#E57373',
    borderRadius: 30,
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
