import React from 'react';
import { useNavigation } from '@react-navigation/native'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Icon, TopNavigationAction, Divider, Layout, Text, TopNavigation } from '@ui-kitten/components'
import { LinearGradient } from 'expo-linear-gradient'

export default function CreateTemplate() {

    const navigation = useNavigation()

    const renderTitle = () => <Text style={styles.title}>My App</Text>
    const BackAction = () => (
        <TopNavigationAction icon={
            <Icon name='arrow-ios-back-outline' style={styles.backIcon} fill='#fff'/>
        } onPress={navigation.goBack} />
    )

    const Topbar = () => (
        <LinearGradient
            colors={['#29C9A2', '#A0ECA5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <TopNavigation
                title={renderTitle}
                style={styles.topNavigation}
                accessoryLeft={BackAction}
                alignment="start"
            />
        </LinearGradient>
    )

    return (
        <Layout style={styles.layoutContainer}>
            <Topbar />
            <Divider />
            <ScrollView style={styles.layoutContainer}>
                <View style={{flex: 1, padding: 16, marginTop: 20 }}>
                    <Text style={styles.title}>Welcome to the Gradient App</Text>
                    <Text style={styles.subtitle}>Your gradient is now active!</Text>
                </View>
            </ScrollView>
        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1, // Asegura que el contenido se distribuya bien dentro del ScrollView
        justifyContent: 'center', // Centra el contenido verticalmente
        alignItems: 'center', // Centra el contenido horizontalmente
        padding: 20,
    },
    topNavigation: {
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff',
    },
    gradient: {
        paddingVertical: 10,
    },
    layoutContainer: {
        backgroundColor: '#fff',
        flex: 1,
    },
});
