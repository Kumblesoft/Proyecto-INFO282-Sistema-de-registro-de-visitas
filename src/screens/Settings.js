import React, { useState, useContext } from 'react'
import { ScrollView, View, StyleSheet, Image } from 'react-native'
import { Layout, Text, TopNavigation, TopNavigationAction, Divider, Menu, MenuItem, Icon } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { IdentifierContext } from '../context/IdentifierContext'
import { IDInputComponent } from '../widgets/EditId'
import { SafeAreaView } from 'react-native-safe-area-context'


export default function Settings() {

    const navigation = useNavigation()
    const { identifier } = useContext(IdentifierContext) // Obtiene el identificador del contexto
    const [ showIDWidget, setShowIDWidget ] = useState(false)

    const BackIcon = props => <Icon name='arrow-ios-back-outline' {...props} style={styles.backIcon} fill='#fff'/>
    const IdIcon = props => <Icon {...props} name='hash'/>
    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />

    const renderTitle = () => (
        <View style={styles.titleContainer}>
            <Text style={styles.title}>{"Settings"}</Text>
        </View>
    )

    const renderOption = option => (
        <View style={styles.titleContainer}>
            <Text style={styles.optionTitle}>{option}</Text>
        </View>
    )

    const handleChangeID = () => setShowIDWidget(!showIDWidget)

    return (
        <Layout style={styles.layoutContainer}>
                <SafeAreaView style={styles.safeArea}>
                <LinearGradient colors={['#2dafb9', '#17b2b6', '#00b4b2', '#00b7ad', '#00b9a7', '#00bba0', '#00bd98', '#00bf8f', '#00c185', '#00c27b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <TopNavigation
                        title={renderTitle()}
                        style={styles.topNavigation}
                        accessoryLeft={BackAction}
                        alignment='start'
                    />
                </LinearGradient>
                </SafeAreaView>
                <Divider />
                <Menu>
                    <MenuItem 
                        title={renderOption("Cambiar ID")}
                        accessoryLeft={IdIcon}
                        onPress={handleChangeID}
                    />
                    { showIDWidget && <IDInputComponent /> }

                    <Divider/>
                </Menu>
                
        </Layout>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#00baa4'
    },
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
    }
})

