import React, { useState } from 'react'
import { SafeAreaView, ScrollView, View, StyleSheet, Image } from 'react-native'
import { Layout, Button, Text, TopNavigation, TopNavigationAction, Divider, Icon} from '@ui-kitten/components'
import DynamicForm from '../components/DynamicForm'
import { useRoute } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const FormFillerScreen = ({ route }) => {
    const { form } = route.params
    const navigation = useNavigation();

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
                <Text style={styles.title}>{form["nombre formulario"]}</Text>
            </View>
    );

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
                            alignment='center'
                        />
                    </LinearGradient>
                    <Divider />
                    
                    <View style={{flex: 1, padding: 16, marginTop: 20 }}>
                        <DynamicForm formData={form}/>
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
        color: '#333',
    },
    backIcon: {
        width: 25,
        height: 25,
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
