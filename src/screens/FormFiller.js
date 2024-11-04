import React, { useState, useRef } from 'react'
import { SafeAreaView, ScrollView, View, StyleSheet, Image, Alert } from 'react-native'
import { Layout, Button, Text, TopNavigation, TopNavigationAction, Divider, Icon, Modal, ButtonGroup} from '@ui-kitten/components'
import DynamicForm from '../components/DynamicForm'
import { useRoute } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const FormFillerScreen = ({ route }) => {
    const { form } = route.params
    const navigation = useNavigation()
    const formRef = useRef()
    const [backAlert, setBackAlert] = useState(false) 

    const BackIcon = (props) => (
        <Icon name='arrow-ios-back-outline' {...props} style={styles.backIcon} fill='#fff'/>
    )

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => handleBack()} />
    )

    function handleBack(){
        const dataMap = formRef.current.getMap()
        if (dataMap.size > 0){
            setBackAlert(true)
        }else{
            navigation.goBack()
        }
    }
    const renderTitle = () => (
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{form["nombre formulario"]}</Text>
            </View>
    )

    const renderTopNavigation = () => (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']}>
        </LinearGradient>
    );

    return (
            <Layout style={styles.layoutContainer}>
                <ScrollView style={styles.layoutContainer}>
                    <LinearGradient colors={['#29C9A2', '#A0ECA5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <TopNavigation
                            title={renderTitle}
                            style={styles.topNavigation}
                            accessoryLeft={BackAction}
                            alignment='start'
                        />
                    </LinearGradient>
                    <Divider />
                    
                    <View style={{flex: 1, padding: 16, marginTop: 20 }}>
                        <DynamicForm formData={form} ref={formRef}/>
                    </View>
                </ScrollView>
                <Modal visible = {backAlert} backdropStyle={styles.backdrop}>
                    <Layout style = {styles.containerBox}>
                    <Text> Hay progreso sin guardar, ¿Seguro que quieres volver?</Text>
                    <ButtonGroup>
                    <Button onPress={() => navigation.goBack()}>Si</Button>
                    <Button onPress={() => setBackAlert(false)}>No</Button>
                    </ButtonGroup>
                    </Layout>
                </Modal>
            </Layout>

    )
}

const styles = StyleSheet.create({
    topNavigation:{
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
    layoutContainer:{
        backgroundColor: '#fff',
        flex: 1,
    },
    containerBox: {
        padding: 10,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#ffffff', // Color fondo suave
        borderWidth: 1,
        borderColor: '#9beba5',
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
});

export default FormFillerScreen
