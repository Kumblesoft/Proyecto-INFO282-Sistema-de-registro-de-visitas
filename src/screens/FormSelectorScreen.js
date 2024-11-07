import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Text, TopNavigation, TopNavigationAction, Divider, Layout, Button, Icon, IconElement } from '@ui-kitten/components'
import { useFormContext } from '../context/FormContext'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'

const FormSelectorScreen = ({ route }) => {
  const navigation = useNavigation()
  const [forms, setForms] = useState(route.params.forms)
  const { selectedForm, setSelectedForm } = useFormContext()
  const [isSelectionMode, setIsSelectionMode] = useState(false); // Modo de selección
  const [selectedForms, setSelectedForms] = useState([]); // Formularios seleccionados

  const handleSelectForm = form => {
    setSelectedForm(form)
    navigation.navigate('Menu')
  }
  const BackIcon = (props) => (
    <Icon name='arrow-ios-back-outline' {...props} style={styles.backIcon} fill='#fff'/>
  )

  const deleteIcon = (props) => (
    <Icon name='trash' {...props} />
  )

  const shareIcon = (props) => (
      <Icon name='share' {...props}/>
  )

  const SelectionIcon = (props) => (
    <Icon name={isSelectionMode ? 'checkmark-square' : 'checkmark-square'} style={styles.backIcon} fill='#fff' {...props} />
  )

  const SelectionAction = () => (
      <TopNavigationAction icon={SelectionIcon} onPress={toggleSelectionMode} />
  )

  //##########################################################################
  //Delete Forms


  const deleteSelectedForms = async () => {

    const updatedForms = forms.filter(
        (form) => !selectedForms.includes(form["nombre formulario"])
    );

    
    setForms(updatedForms);

    setSelectedForms([]);
    setIsSelectionMode(false);
    console.log("Formularios restantes después de la eliminación:", updatedForms);
  };

  //##########################################################################

  const toggleSelectionMode = () => {
      setIsSelectionMode(!isSelectionMode);
      setSelectedForms([]); // Resetear selección al activar/desactivar modo
  }

  const handleSelection = (item) => {
    if (isSelectionMode) {
      setSelectedForms((prev) =>
          prev.includes(item["nombre formulario"]) 
              ? prev.filter((id) => id !== item["nombre formulario"]) 
              : [...prev, item["nombre formulario"]]
      );
    } 
  };

  const handlePress = (form) => {
    if (isSelectionMode) {
      handleSelection(form)
    } 
    else {
      setSelectedForm(form)
      navigation.navigate('Menu')
    }
  }


  const BackAction = () => (
      <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
  )
  const renderTitle = () => (
      <View style={styles.titleContainer}>
          <Text style={styles.title}>Selector de formularios</Text>
      </View>
  )

  const renderItem = ({ item }) => (
    <TouchableOpacity
        style={[styles.containerBox, selectedForms.includes(item["nombre formulario"]) && styles.selectedItem]}
        onPress={() => handlePress(item)}
        onLongPress={toggleSelectionMode}
    >
        <Text style={styles.itemText}>{item["nombre formulario"]}</Text>
    </TouchableOpacity>
  )

  return (
    <>
        <LinearGradient colors={['#2dafb9', '#17b2b6', '#00b4b2', '#00b7ad', '#00b9a7', '#00bba0', '#00bd98', '#00bf8f', '#00c185', '#00c27b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <TopNavigation
              title={renderTitle}
              style={styles.topNavigation}
              accessoryLeft={BackAction}
              accessoryRight={SelectionAction}
              alignment='center'
          />
        </LinearGradient>
        <Divider />
        <Layout style={styles.container}>
          <FlatList
            data={forms.filter((form) => form !== null)}
            renderItem={renderItem}
            keyExtractor={(item) => item["nombre formulario"]}
            contentContainerStyle={styles.listContainer}
          />
          {isSelectionMode && (
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
          )}
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
  backIcon: {
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
})

export default FormSelectorScreen
