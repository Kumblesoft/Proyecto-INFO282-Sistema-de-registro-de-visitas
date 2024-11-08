import React, { useState } from 'react'
import { SafeAreaView, ScrollView, View, StyleSheet, Image } from 'react-native'
import { Layout, Button, Text, TopNavigation, TopNavigationAction, Divider, Icon} from '@ui-kitten/components'
import DynamicForm from '../components/DynamicForm'
import { useRoute } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFormContext } from '../context/FormContext'

const FormFillerScreen = ({ route }) => {
    const context = useFormContext()
    const disabledSave = route.params?.disabledSave ?? false
    const form = route.params?.form ?? context.selectedForm
    //console.log(form, route.params)

    const navigation = useNavigation();

    const BackIcon = props => (
        <Icon name='arrow-ios-back-outline' {...props} style={styles.backIcon} fill='#fff'/>
    );

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
    );
    const renderTitle = () => (
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{form["nombre formulario"]}</Text>
            </View>
    );


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
                    
                    <View style={{flex: 1, padding: 16, marginTop: 20 }}>
                        <DynamicForm formData={form} disabledSave={disabledSave}/>
                    </View>
                    
                    
                </ScrollView>
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
});

export default FormFillerScreen
