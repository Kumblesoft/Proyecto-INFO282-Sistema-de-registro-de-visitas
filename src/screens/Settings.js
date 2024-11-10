import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView, ScrollView, View, StyleSheet, Image, ImageBackground } from 'react-native'
import { Layout, Button, Text, TopNavigation, TopNavigationAction, Divider, IconElement, Menu, MenuItem, Icon } from '@ui-kitten/components'
import DynamicForm from '../components/DynamicForm'
import { useRoute } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { IdentifierContext } from '../context/IdentifierContext'
import { IDInputComponent } from '../widgets/EditId'
import { Audio } from 'expo-av'


export default function Settings() {

    const navigation = useNavigation()
    const { identifier } = useContext(IdentifierContext) // Obtiene el identificador del contexto
    const [mostrarFeddy, setMostrarFeddy] = useState(false)
    const [sound, setSound] = useState(null)

    const handleFeddy = () => setMostrarFeddy(!mostrarFeddy)
    

    const handlePlaySound = async () => {
        // Cargar el sonido
        const { sound } = await Audio.Sound.createAsync(require('../assets/ST.mp3'))
        setSound(sound)

        // Reproducir el sonido
        await sound.playAsync()
    }

    const BackIcon = props => 
        <Icon name='arrow-ios-back-outline' {...props} style={styles.backIcon} fill='#fff'/>

    const BackAction = () => 
        <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
    

    const renderTitle = () => 
        <View style={styles.titleContainer}>
            <Text style={styles.title}>{"Settings"}</Text>
        </View>
    

    const renderOption = option => 
        <View style={styles.titleContainer}>
            <Text style={styles.optionTitle}>{option}</Text>
        </View>
    

    const renderTopNavigation = () => 
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']}></LinearGradient>
    

    const IdIcon = props => 
        <Icon {...props} name='hash'/>
    

    const StarIcon = props => 
        <Icon {...props} name='star'/>
    

    const STIcon = props => 
        <Icon {...props} name='globe-2'/>
    

    const InacapIcon = (props) => 
        <Icon {...props} name='npm' />

    const handleChangeID = () => <></>

    // Limpia el recurso de sonido al desmontar el componente
    React.useEffect(() => {
        console.log("Identifier from context:", identifier) // Para verificar en consola
        return () => {
            if (sound) {
                sound.unloadAsync()
            }
        }
    }, [sound, identifier])

    return (
        <Layout style={styles.layoutContainer}>
                <ScrollView style={styles.layoutContainer}>
                    <LinearGradient colors={['#2dafb9', '#17b2b6', '#00b4b2', '#00b7ad', '#00b9a7', '#00bba0', '#00bd98', '#00bf8f', '#00c185', '#00c27b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <TopNavigation
                            title={renderTitle()}
                            style={styles.topNavigation}
                            accessoryLeft={BackAction}
                            alignment='start'
                        />
                    </LinearGradient>
                    <Divider />
                    <IDInputComponent />
                    <Menu>
                        <MenuItem 
                            title={renderOption("Cambiar ID")}
                            accessoryLeft={IdIcon}
                            onPress={handleChangeID}
                        />
                        <MenuItem 
                            title={renderOption("Feddy?")}
                            accessoryLeft={StarIcon}
                            onPress={handleFeddy}
                        />
                        <MenuItem 
                            title={renderOption("¿Santo tomas?")}
                            accessoryLeft={STIcon}
                            onPress={handlePlaySound}
                        />
                        <MenuItem 
                            title={renderOption("Inacap")}
                            accessoryLeft={InacapIcon}
                        />
                        <Divider/>
                    </Menu>
                    {mostrarFeddy && (
                      <>
                          <Image 
                              style={{ alignSelf: 'center', width: "100%", height: undefined, aspectRatio: 750/1000}} 
                              source={require('../assets/working.png')}
                              resizeMode='contain'
                          />
                          <Text style={{ alignSelf: 'center', fontSize: 40, fontWeight: 'bold' }}>
                              we are working
                          </Text>
                      </>
                    )}
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
    }
})

