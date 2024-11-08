import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, ScrollView, View, StyleSheet, Image, ImageBackground } from 'react-native'
import { Layout, Button, Text, TopNavigation, TopNavigationAction, Divider, IconElement, Menu, MenuItem, Icon } from '@ui-kitten/components'
import DynamicForm from '../components/DynamicForm'
import { useRoute } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { IdentifierContext } from '../context/IdentifierContext'
import { IDInputComponent } from '../widgets/EditId'

export default function Settings() {

    const navigation = useNavigation()

    const { identifier } = useContext(IdentifierContext) // Obtiene el identificador del contexto

    useEffect(() => {
        console.log("Identifier from context:", identifier) // Para verificar en consola
    }, [identifier])

    const BackIcon = (props) => (
        <Icon name='arrow-ios-back-outline' {...props} style={styles.backIcon} fill='#fff' />
    )

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
    )

    const renderTitle = () => (
        <View style={styles.titleContainer}>
            <Text style={styles.title}>{"Settings"}</Text>
        </View>
    )

    const renderOption = (option) => (
        <View style={styles.titleContainer}>
            <Text style={styles.optionTitle}>{option}</Text>
        </View>
    )

    const renderTopNavigation = () => (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']}>
        </LinearGradient>
    )

    const IdIcon = (props) => (
        <Icon
            {...props}
            name='hash'
        />
    )

    const handleChangeID = () => (
        <></>
    )

    return (
        <Layout style={styles.layoutContainer}>
            <ScrollView style={styles.layoutContainer}>
                <LinearGradient colors={['#29C9A2', '#A0ECA5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <TopNavigation
                        title={renderTitle()}
                        style={styles.topNavigation}
                        accessoryLeft={BackAction}
                        alignment='start'
                    />
                </LinearGradient>
                <IDInputComponent />
            </ScrollView>
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
    optionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000'
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
})
