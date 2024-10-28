import React, { useState } from 'react'
import { SafeAreaView, ScrollView, View, StyleSheet, Image, ImageBackground } from 'react-native'
import { Layout, Button, Text, TopNavigation, TopNavigationAction, Divider, Icon} from '@ui-kitten/components'
import DynamicForm from '../components/DynamicForm'
import { useRoute } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Settings () {

    const navigation = useNavigation();

    const BackIcon = (props) => (
        <Icon name='arrow-ios-back-outline' {...props} style={styles.backIcon} fill='#fff'/>
    );

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
    );
    const renderTitle = () => (
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{"Settings"}</Text>
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
                            alignment='start'
                        />
                    </LinearGradient>
                    <Divider />
                    <Image style={{width: 350, height: 200, alignSelf: 'center', marginTop: 200}} source={require('../assets/imagenSeria.gif')}></Image>
                    <Text style={{alignSelf:'center', fontSize: 80, fontWeight:'bold'}}>fai nais a feddys</Text>
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