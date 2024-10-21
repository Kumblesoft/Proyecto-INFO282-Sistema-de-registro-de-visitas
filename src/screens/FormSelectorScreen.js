import React from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Text, TopNavigation, TopNavigationAction, Divider, Layout } from '@ui-kitten/components'
import { useFormContext } from '../context/FormContext'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'

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
  );

  const BackAction = () => (
      <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
  );
  const renderTitle = () => (
      <View style={styles.titleContainer}>
          <Text style={styles.title}>Selector de formularios</Text>
      </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelectForm(item)}>
      <Text style={styles.itemText}>{item["nombre formulario"]}</Text>
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
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
  },
  topNavigation:{
    backgroundColor: "transparent",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
})

export default FormSelectorScreen
