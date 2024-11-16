import React, { useState, useRef } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { Layout, Button, Text, TopNavigation, TopNavigationAction, Divider, Icon, Modal } from '@ui-kitten/components'
import DynamicForm from '../components/DynamicForm'
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFormContext } from '../context/SelectedFormContext'

const FormFillerScreen = ({ route }) => {
    const [backAlert, setBackAlert] = useState(false)
    const context = useFormContext()
    const disabledSave = route.params?.disabledSave ?? false
    const form = route.params?.form ?? context.selectedForm
    const formRef = useRef()
    const navigation = useNavigation()

    const BackIcon = props => (
        <Icon name='arrow-ios-back-outline' {...props} style={styles.backIcon} fill='#fff' />
    )

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => handleBack()} />
    )

    function handleBack() {
        const dataMap = formRef.current.getMap()
        if (dataMap.size > 0) setBackAlert(true)
        else navigation.goBack()
    }
    const renderTitle = () => (
        <View style={styles.titleContainer}>
            <Text style={styles.title}>{form["nombre formulario"]}</Text>
        </View>
    )

    return (
        <Layout style={styles.layoutContainer}>
            <LinearGradient colors={['#29C9A2', '#A0ECA5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <TopNavigation
                    title={renderTitle}
                    style={styles.topNavigation}
                    accessoryLeft={BackAction}
                    alignment='start'
                />
            </LinearGradient>
            <Divider />
            <ScrollView style={styles.layoutContainer}>

                <View style={{ flex: 1, padding: 16, marginTop: 20 }}>
                    <DynamicForm formData={form} disabledSave={disabledSave} ref={formRef} />
                </View>
            </ScrollView>
            <Modal visible = {backAlert} backdropStyle={styles.backdrop}>
                <Layout style = {styles.containerBox}>
                    <Text style={styles.modalTitle}> ¿Quieres volver?</Text>
                    <Text style={{fontSize: 18, marginBottom: 15}}> Aún hay progreso sin guardar</Text>
                        <Layout style={styles.buttonContainer}>
                            <Button style = {{flex : 1, marginRight: '10%'}} status='info' onPress={() => navigation.goBack()}>Si</Button>
                            <Button style = {{flex : 1, marginLeft: '10%'}} status='danger' onPress={() => setBackAlert(false)}>No</Button>
                        </Layout>
                </Layout>
            </Modal>
        </Layout>
    )
}

const styles = StyleSheet.create({
    topNavigation: {
        backgroundColor: 'transparent'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff',
    },
    backIcon: {
        width: 40,
        height: 40,
        color: '#fff'
    },
    gradient: {
        paddingVertical: 10, // Ajusta el padding para dar espacio al texto
    },
    layoutContainer: {
        backgroundColor: '#fff',
        flex: 1,
    },
    containerBox: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#ffffff', // Color fondo suave
        borderWidth: 1,
        borderColor: '#00b7ae',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.9,
        shadowRadius: 2,
        elevation: 3,
        alignItems: 'flex-start'
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    buttonContainer: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
    modalTitle: {
        fontSize: 22,
        marginBottom: 10,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
});

export default FormFillerScreen
