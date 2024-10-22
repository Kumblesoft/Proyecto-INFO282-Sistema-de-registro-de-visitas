import { Result, Err, Ok } from '../commonStructures/resultEnum'
import React, { useState } from 'react'
import { Button, Image, View, StyleSheet, Alert, Linking, TouchableOpacity, Modal, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import cameraIcon from '../assets/camera.png'
import galleryIcon from '../assets/gallery.png'

class CameraConfiguration {
  constructor(setImage = img => {}, allowsEditing = true, aspect = [4, 3], quality = 1) {
    this.setImage = setImage
    this.allowsEditing = allowsEditing
    this.aspect = aspect
    this.quality = quality
  }

  getSettings() {
    return {
      allowsEditing: this.allowsEditing,
      aspect: this.aspect,
      quality: this.quality
    }
  }
}

export const Camera = ({title, required, cameraConfiguration }) => {
  const [image, setImage] = useState(null)
  const [isMenuVisible, setMenuVisible] = useState(false)

  async function openMedia(cameraConfiguration, launchFunction) {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera/Gallery permissions are required to proceed. Please enable them in your app settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      )
    }
    if (status !== 'granted') return (new Err('Permissions not granted by user')).show()

    const result = await launchFunction(cameraConfiguration.getSettings())
    if (result.canceled) return new Err('Operation cancelled')

    const imageUri = result.assets[0].uri

    if (launchFunction === ImagePicker.launchCameraAsync) {
      try {
        const asset = await MediaLibrary.createAssetAsync(imageUri)
        await MediaLibrary.createAlbumAsync('Fotos', asset, false)
      } catch (error) {
        return new Err(`Error saving file in gallery: ${error}`).show()
      }
    }

    cameraConfiguration.setImage(imageUri)
    setImage(imageUri) // Actualiza la imagen seleccionada
    return new Ok(imageUri)
  }

  const openCamera = async () => openMedia(cameraConfiguration, ImagePicker.launchCameraAsync)
  const openGallery = async () => openMedia(cameraConfiguration, ImagePicker.launchImageLibraryAsync)
  const toggleMenu = () => setMenuVisible(!isMenuVisible)

  const originalSetImage = cameraConfiguration.setImage.bind(cameraConfiguration)

  cameraConfiguration.setImage = img => {
    originalSetImage(img)
    setImage(img)
  }

  const removeImage = () => {
    setImage(null)
    cameraConfiguration.setImage(null)
    toggleMenu()
  }

  return (
    <View style={styles.container}>
      {title && (
        <Text style={styles.title}>
          {title}
          {required ? "*" : ""}
        </Text>
      )}
      
      {/* Contenedor que muestra el icono o imagen seleccionada */}
      <TouchableOpacity onPress={toggleMenu} style={styles.imageContainer} activeOpacity={0.7}>
        {image ? (
          <Image source={{ uri: image }} style={styles.selectedImage} />
        ) : (
          <Image source={cameraIcon} style={styles.cameraIcon} />
        )}
      </TouchableOpacity>

      {/* Menú emergente (modal) con las opciones de Cámara, Galería y Eliminar Imagen */}
      <Modal visible={isMenuVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.menu}>
          <Text style={styles.title}>Seleccione una opción</Text>
            <TouchableOpacity onPress={openCamera} style={styles.menuItem}>
              <Image source={cameraIcon} style={styles.icon} />
              <Text style={styles.menuText}>Cámara</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openGallery} style={styles.menuItem}>
              <Image source={galleryIcon} style={styles.icon} />
              <Text style={styles.menuText}>Galería</Text>
            </TouchableOpacity>

            {/* Mostrar el botón de eliminar sólo si hay una imagen */}
            {image && (
              <TouchableOpacity onPress={removeImage} style={styles.menuItem}>
                <Text style={{...styles.menuText, color: "red"}}>Eliminar Imagen</Text>
              </TouchableOpacity>
            )}

            <Button title="Cerrar" onPress={toggleMenu} />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default CameraConfiguration

const styles = StyleSheet.create({
  title: {
    fontSize: 20, // Tamaño de fuente
    fontWeight: 'bold', // Texto en negrita
    marginBottom: 5, // Espacio debajo del título
    textAlign: 'left', // Alinear texto a la izquierda
    alignSelf: 'flex-start' // Alinear el componente a la izquierda dentro de su contenedor
  },
  container: {
    marginVertical: 10,
    alignItems: 'center' // Centra el texto y el ícono en la misma línea vertical
  },
  imageContainer: {
    width: 300, // Ajusta el tamaño del contenedor
    height: 150,
    backgroundColor: '#f0f0f0', // Fondo gris claro
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Bordes redondeados
    marginBottom: 20, // Espacio inferior
    shadowColor: '#000', // Sombra para dar efecto de botón
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5 // Solo para Android
  },
  cameraIcon: {
    width: 80, // Tamaño del ícono de cámara
    height: 80
  },
  selectedImage: {
    width: '100%', // La imagen seleccionada ocupa todo el contenedor
    height: '100%',
    borderRadius: 10
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)' // Fondo transparente oscuro
  },
  menu: {
    backgroundColor: 'white', // Fondo blanco del menú
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: 300, // Ajusta el tamaño del contenedor
    height: 260
  },
  menuItem: {
    flexDirection: 'row', // Ícono y texto en línea
    alignItems: 'center',
    marginVertical: 10
  },
  icon: {
    width: 40, // Ajusta el tamaño de los íconos del menú
    height: 40,
    marginRight: 10
  },
  menuText: {
    fontSize: 18
  }
})
