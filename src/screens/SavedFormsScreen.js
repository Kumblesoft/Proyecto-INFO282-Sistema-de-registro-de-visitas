import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, FlatList, Button, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SavedForms = () => {
    const [forms, setForms] = useState([])

    const fetchSavedForms = async () => {
    try {
        const savedForms = JSON.parse(await AsyncStorage.getItem('savedForms')) || []
        setForms(savedForms)
    } catch (error) {
        console.error('Error :', error)
    }
    }

    const deleteForm = async (id) => {
    try {
        const updatedForms = forms.filter(form => form.id !== id)
        await AsyncStorage.setItem('savedForms', JSON.stringify(updatedForms))
        setForms(updatedForms)
        Alert.alert('Exito', 'Formulario eliminado')
    } catch (error) {
        console.error('Error :', error)
        Alert.alert('Error', 'No se pudo eliminar el formulario')
    }
    }

    useEffect(() => {
        fetchSavedForms()
        }, [])

    const renderItem = ({ item }) => (
    <View style={styles.formItem}>
        <Text style={styles.formTitle}>{item.nombreFormulario}</Text>
        <Button title="Eliminar" onPress={() => deleteForm(item.id)} />
    </View>
    )

    return (
    <View style={styles.container}>
        <Text style={styles.title}>Formularios Guardados</Text>
        <FlatList
        data={forms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        />
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    listContainer: {
        paddingBottom: 100,
    },
    formItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    formTitle: {
        fontSize: 18,
    },
})

export default SavedForms
