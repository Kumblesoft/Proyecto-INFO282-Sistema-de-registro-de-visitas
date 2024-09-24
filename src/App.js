import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [image, setImage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false); // Estado para controlar el modal de previsualización
  const MAX_IMAGE_SIZE_MB = 10; // Tamaño máximo en MB

  const checkImageSize = async (uri) => {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    const fileSizeInMB = fileInfo.size / (1024 * 1024); // Convertir a MB

    if (fileSizeInMB > MAX_IMAGE_SIZE_MB) {
      Alert.alert(`La imagen supera el tamaño máximo permitido de ${MAX_IMAGE_SIZE_MB}MB`);
      return false;
    }
    return true;
  };

  const openCamera = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      alert('Se requiere permiso para acceder a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1, // Ajustar la calidad según sea necesario
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      // Comprobar el tamaño de la imagen
      const isValidSize = await checkImageSize(imageUri);
      if (!isValidSize) return;

      // Guardar la imagen en la galería
      try {
        const asset = await MediaLibrary.createAssetAsync(imageUri);
        await MediaLibrary.createAlbumAsync('Fotos', asset, false);
        Alert.alert('Imagen guardada correctamente en la galería.');
      } catch (error) {
        console.log('Error al guardar la imagen en la galería:', error);
      }

      // Guardar la imagen tomada en el estado para mostrarla en la app
      setImage(imageUri);
    }
  };

  const openGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se requiere permiso para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1, // Ajustar la calidad según sea necesario
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      // Comprobar el tamaño de la imagen
      const isValidSize = await checkImageSize(imageUri);
      if (!isValidSize) return;

      setImage(imageUri);
      Alert.alert('Imagen seleccionada correctamente de la galería.');
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible); // Mostrar u ocultar el modal
  };

  return (
    <View style={styles.container}>
      <Button title="Abrir Cámara" onPress={openCamera} />
      <Button title="Seleccionar Imagen de Galería" onPress={openGaleria} />

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginTop: 20,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  fullImage: {
    width: 300,
    height: 300,
  },
});
