import { Err, Ok } from '../commonStructures/resultEnum'
import React, { useState } from 'react'
import { Image, View, StyleSheet, Alert, Linking, TouchableOpacity, Modal, Text } from 'react-native'
import { Button, Icon, Layout } from '@ui-kitten/components'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import * as FileSystem from 'expo-file-system'
import cameraIcon from '../assets/camera.png'
import galleryIcon from '../assets/gallery.png'

/**
 * Class representing the configuration settings for the camera.
 */
class CameraConfiguration {
  /**
   * Create a CameraConfiguration instance.
   * @param {function} setImage - Function to set the image.
   * @param {boolean} [allowsEditing=true] - Indicates if editing is allowed.
   * @param {Array<number>} [aspect=[4, 3]] - The aspect ratio for the camera.
   * @param {number} [quality=1] - The quality of the image (0 to 1).
   */
  constructor(setImage = img => { }, allowsEditing = true, aspect = [4, 3], quality = 1) {
    this.setImage = setImage
    this.allowsEditing = allowsEditing
    this.aspect = aspect
    this.quality = quality
  }



  /**
   * Get the camera configuration settings.
   * @returns {Object} The camera settings.
   * @property {boolean} allowsEditing - Indicates if editing is allowed.
   * @property {Array<number>} aspect - The aspect ratio for the camera.
   * @property {number} quality - The quality of the image.
   */
  getSettings() {
    return {
      allowsEditing: this.allowsEditing,
      aspect: this.aspect,
      quality: this.quality
    }
  }
}


/**
 * Camera component for capturing images or selecting them from the gallery.
 *
 * @param {Object} cameraConfiguration - Configuration object for the camera.
 * @param {function} cameraConfiguration.setImage - Function to set the selected image.
 * @param {function} cameraConfiguration.setImageSetter - Function to update the image setter function.
 * @param {Array} requiredFieldRef - A variable to pass by reference the Camera "requiered field text" toggle method
 * 
 * @returns {JSX.Element} Rendered camera component.
 */
export const Camera = ({ title, required, cameraConfiguration, requiredFieldRef, refreshFieldRef, disabled }) => {
  const [image, setImage] = useState(null)
  const [isMenuVisible, setMenuVisible] = useState(false)
  const [isRequiredAlert, setIsRequiredAlert] = useState(false)

  async function openMedia(cameraConfiguration, launchFunction) {
    if (disabled) return new Err('Camera is disabled').show();
    let mediaPermissions = await ImagePicker.requestMediaLibraryPermissionsAsync()
    let cameraPermissions = await ImagePicker.requestCameraPermissionsAsync()
    let permissionsGranted = mediaPermissions.status === 'granted' && cameraPermissions.status === 'granted'

    if (!permissionsGranted) {
      setMenuVisible(false)
      Alert.alert(
        'Permissions Required',
        'Camera/Gallery permissions are required to proceed. Please enable them in your app settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      )
    }
    setMenuVisible(true)
    mediaPermissions = await ImagePicker.requestMediaLibraryPermissionsAsync()
    cameraPermissions = await ImagePicker.requestCameraPermissionsAsync()
    permissionsGranted = mediaPermissions.status === 'granted' && cameraPermissions.status === 'granted'
    if (!permissionsGranted) return (new Err('Permissions not granted by user')).show()

    const result = await launchFunction(cameraConfiguration.getSettings())
    if (result.canceled) return new Err('Operation cancelled')

    const imageUri = result.assets[0].uri
    const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 })
    if (launchFunction === ImagePicker.launchCameraAsync) {
      try {
        const asset = await MediaLibrary.createAssetAsync(imageUri)
        await MediaLibrary.createAlbumAsync('Fotos', asset, false)
      } catch (error) {
        return new Err(`Error saving file in gallery: ${error}`).show()
      }
    }

    cameraConfiguration.setImage(base64)
    setImage(imageUri) // Actualiza la imagen seleccionada
    setIsRequiredAlert(false)
    setMenuVisible(false)
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

  requiredFieldRef.current = () => {
    if (required) {
      setIsRequiredAlert(true)
    } else {
      setIsRequiredAlert(false)
    }
  }
  refreshFieldRef.current = () => {
    setImage(null)
  }

  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.title, {alignSelf: 'flex-start'}]}>
          {title}
          {required ? <Text style={{ color: 'red' }}>*</Text> : ""}
        </Text>
      )}

      {/* Contenedor que muestra el icono o imagen seleccionada */}
      <TouchableOpacity onPress={toggleMenu}
        disabled={disabled}
        style={[
          styles.imageContainer,
          isRequiredAlert && { backgroundColor: '#FFCCCC' } // Change background to red if isRequiredAlert is true
        ]}
        activeOpacity={0.7}>
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
            
            <Text style={styles.title}>{image ? "¿Cómo reemplazar la imagen?" : "¿Cómo quiere adjuntar la imagen?"}</Text>

            <View style={styles.iconContainer}>
              {/* Ícono de galería */}
              <TouchableOpacity onPress={openGallery} style={styles.menuItem}>
                <Image source={galleryIcon} style={styles.icon} />
                <Text style={styles.menuText}>Galería</Text>
              </TouchableOpacity>

              {/* Ícono de cámara */}
              <TouchableOpacity onPress={openCamera} style={styles.menuItem}>
                <Image source={cameraIcon} style={styles.icon} />
                <Text style={styles.menuText}>Cámara</Text>
              </TouchableOpacity>
            </View>
            {/* Contenedor de botones (Eliminar y Cerrar) */}
            <Layout style={styles.buttonContainer}>
              {/* Mostrar el botón "Eliminar" solo si hay una imagen */}
              {image && (
                <Button onPress={removeImage} style={styles.deleteButton} status="danger"
                  accessoryLeft={<Icon name='trash-2-outline' fill='white' />}
                >
                  {"Eliminar"}
                </Button>
              )}
              <Button onPress={toggleMenu} style={styles.closeButton} status="info"
                accessoryLeft={<Icon name='close-outline' fill='white' />}
              >
                {"Volver"}
              </Button>
            </Layout>
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
    marginBottom: 10, // Espacio debajo del título
    textAlign: 'center'
  },
  container: {
    marginVertical: 10,
    alignItems: 'center' // Centra el texto y el ícono en la misma línea vertical
  },
  imageContainer: {
    width: "100%", // Ajusta el tamaño del contenedor
    height: 150,
    backgroundColor: '#f0f0f0', // Fondo gris claro
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Bordes redondeados
    marginBottom: 20, // Espacio inferior
    shadowColor: '#000', // Sombra para dar efecto de botón
    borderColor: '#00b7ae',
    borderWidth: 1,
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
    width: '98%' // Ancho del menú emergente
  },
  menuText: {
    fontSize: 18
  },
  deleteButton: {
    width: '50%'
  },
  closeButton: {
    width: '50%'
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 20 // Espaciado entre los íconos y los botones
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  menuItem: {
    alignItems: 'center',
    flex: 1,
    padding: 10,
  },
  icon: {
    width: 35,
    height: 35,
    marginBottom: 5,
  },
  menuText: {
    fontSize: 16,
  },
})
