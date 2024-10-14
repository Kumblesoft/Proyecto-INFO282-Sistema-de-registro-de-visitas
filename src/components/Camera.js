import { Result, Err, Ok } from '../commonStructures/resultEnum'
import React, { useState } from 'react'
import { Button, Image, View, StyleSheet, Alert, Linking, TouchableOpacity, Modal } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import { Text } from '@ui-kitten/components'
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
  constructor(setImage = img => {}, allowsEditing = true, aspect = [4, 3], quality = 1) {
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
 * 
 * @returns {JSX.Element} Rendered camera component.
 */
export const Camera = ({title, required, cameraConfiguration }) => {
  const [image, setImage] = useState(null) //! Modify this when the display modal is no longer needed
  const [isModalVisible, setModalVisible] = useState(false) 

  async function openMedia(cameraConfiguration, launchFunction) {
    let mediaPermissions = await ImagePicker.requestMediaLibraryPermissionsAsync()
    let cameraPermissions = await ImagePicker.requestCameraPermissionsAsync()    

    // Check if permissions are granted, if not show alert and return
    if (mediaPermissions.status !== 'granted' || cameraPermissions.status !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera/Gallery permissions are required to proceed. Please enable them in your app settings.',
        [
          { text: 'Cancel', style: 'cancel' }, 
          { text: 'Open Settings', onPress: () => Linking.openSettings() } // Redirect to settings
        ]
      )
    }
    if (mediaPermissions.status !== 'granted' || cameraPermissions.status !== 'granted')
       return (new Err('Permissions not granted by user')).show()
  
    const result = await launchFunction(cameraConfiguration.getSettings())
    if (result.canceled) return new Err('Operation cancelled')
    
    const imageUri = result.assets[0].uri
  
    // Save the image in the gallery
    if (launchFunction === ImagePicker.launchCameraAsync) {
      try {
        const asset = await MediaLibrary.createAssetAsync(imageUri)
        await MediaLibrary.createAlbumAsync('Fotos', asset, false)
      } catch (error) {
        return new Err(`Error saving file in gallery: ${error}`).show()
      }
    }
    
    console.log(cameraConfiguration)
    cameraConfiguration.setImage(imageUri) // Save the image in the state
    return new Ok(imageUri)
  }

  const openCamera = async () => openMedia(cameraConfiguration, ImagePicker.launchCameraAsync)
  const openGallery = async () => openMedia(cameraConfiguration, ImagePicker.launchImageLibraryAsync)
  const toggleModal = () => setModalVisible(!isModalVisible) 
  
  // Create a new function that combines the existing behavior with additional functionality
  const originalSetImage = cameraConfiguration.setImage.bind(cameraConfiguration) // Preserve the original context
  
  //! Modify this when the display modal is no longer needed
  cameraConfiguration.setImage = img => {
      originalSetImage(img) // Call the original setImage function
      setImage(img) // Call the additional function
  } 

  return (
    <View style={styles.container}>
      {title && (
        <Text category="h6">
          {title}
          {required ? "*" : ""}
        </Text>
      )}
      <Button title="Abrir Cámara" onPress={openCamera} />
      <Button title="Seleccionar Imagen de Galería" onPress={openGallery} />

      {image && (
        <TouchableOpacity onPress={toggleModal}>
          <Image source={{ uri: image }} style={styles.thumbnail} />
        </TouchableOpacity>
      )}

      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: image }} style={styles.fullImage} />
          <Button title="Cerrar" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  )
}

export default CameraConfiguration

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginTop: 20,
    borderRadius: 10
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  fullImage: {
    width: 300,
    height: 300
  }
})
