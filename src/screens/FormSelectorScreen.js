import React from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Text, TopNavigation, TopNavigationAction, Divider, Layout } from '@ui-kitten/components'
import { useFormContext } from '../context/FormContext'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'

const FormSelectorScreen = ({ route }) => {
  const navigation = useNavigation()
  const { forms } = route.params
  const { selectedForm, setSelectedForm } = useFormContext()

  const handleSelectForm = form => {
    setSelectedForm(form)
    navigation.navigate('Menu')
  }
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
    <View style={styles.containerBox}>
      <TouchableOpacity style={styles.textContainer} onPress={() => handleSelectForm(item)}>
        <Text style={styles.itemText}>{item["nombre formulario"]}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.shareButton} onPress={() => shareFormTemplate(item)}>
        <Image source={require('../assets/share.png')} style={styles.shareIcon} />
      </TouchableOpacity>
    
    </View>
    /*

    <TouchableOpacity style={styles.containerBox} onPress={() => handleSelectForm(item)}>
    <Text style={styles.itemText}>{item["nombre formulario"]}</Text>
    <TouchableOpacity style={styles.shareButton}>
      <Text style={styles.shareButtonText}>Compartir</Text>
    </TouchableOpacity>
    </TouchableOpacity>}
    */
  )

  const shareFormTemplate = () => {
      const objectStringified = JSON.stringify(selectedForm)
      const filePath = `${FileSystem.cacheDirectory}plantillaFormulario.json`

      // Intentar compartir usando un archivo temporal
      FileSystem.writeAsStringAsync(filePath, objectStringified).then( 
        () => Sharing.shareAsync(filePath, {
          dialogTitle: 'Compartir JSON como archivo',
          mimeType: 'application/json',
          UTI: 'public.json'
        })
      // Si se compartio correctamente
      ).then( 
        response => {
          if (response === Sharing.sharedAction) 
            Alert.alert('¡Compartido!', 'El archivo JSON se compartió correctamente')
        }
      // Si no se pudo compartir 
      ).catch(error => {
          console.error('Error al compartir:', error);
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

  const renderFooter = () => (
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <Text style={styles.backButtonText}>Volver</Text>
    </TouchableOpacity>
  )

  return (
    <>
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
          keyExtractor={(item) => item["nombre formulario"]}
          contentContainerStyle={styles.listContainer}
        />
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
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

export default FormSelectorScreen
