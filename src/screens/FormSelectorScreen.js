import React, {useState} from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Button, Text, TopNavigation, TopNavigationAction, Divider, Layout, Modal, Card } from '@ui-kitten/components'
import { useFormContext } from '../context/FormContext'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import * as Animatable from 'react-native-animatable'
import shareTypes from '../commonStructures/shareTypes'

const FormSelectorScreen = () => {
  const navigation = useNavigation()
  const forms = require("../TestForms/forms.json")
  const [ isOptionModalVisible, setIsOptionModalVisible ] = useState(false)
  const [ selectedItem, setSelectedItem ] = useState({"nombre formulario": "err"})
  const { setSelectedForm } = useFormContext()


  const BackIcon = () => (
    <Image
        source={require('../assets/arrow_back.png')}
        style={styles.backIcon}
    />
  )

  const BackAction = () => (
      <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
  )
  const renderTitle = () => (
      <View style={styles.titleContainer}>
          <Text style={styles.title}>Selector de formularios</Text>
      </View>
  )

  const renderItem = ({ item }) => (

    <TouchableOpacity style={styles.textContainer} onPress={() => {
      setSelectedForm(item)
      navigation.goBack()
    }}>
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
          console.error('Error al crear archivo:', error);
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

    const onView = () => {
      setIsOptionModalVisible(false)
      navigation.navigate('FormFiller', { form: selectedItem, disabledSave: true })
    }
    const onShare = shareFormTemplate
    const onEdit = () => console.log("Editar")
    const onSelect = item => {
      setSelectedForm(item)
      navigation.goBack()
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
      <LinearGradient colors={['#29C9A2', '#A0ECA5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <TopNavigation
          title={renderTitle}
          style={styles.topNavigation}
          accessoryLeft={BackAction}
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
  topNavigation:{
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
        borderWidth: 2,
        borderColor: '#9beba5',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
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
  backIcon: {
    width: 25,
    height: 25,
  },
  shareButton: {
    width: 40, // 15% del ancho del contenedor
    height: 40, // 100% de la altura del contenedor
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8, // Bordes redondeados
    backgroundColor: '#29C9A2', // Color del botón de compartir
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
