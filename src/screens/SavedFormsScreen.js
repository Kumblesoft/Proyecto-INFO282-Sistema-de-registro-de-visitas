import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, FlatList, Alert, TouchableOpacity, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Modal, Card, TopNavigation, TopNavigationAction, Divider, Layout, Button, Icon, Select, SelectItem, RangeCalendar, NativeDateService, Input } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import * as FileSystem from 'expo-file-system' 
import * as Sharing from 'expo-sharing'

const deleteIcon = (props) => (
    <Icon name='trash' {...props} />
)

const shareIcon = (props) => (
    <Icon name='share' {...props}/>
)

const downwardArrow = (props) => (
    <Icon name='arrow-downward-outline' {...props}/>
)

const upwardArrow = (props) => (
    <Icon name='arrow-upward-outline' {...props}/>
)




const SavedForms = () => {
    const navigation = useNavigation()
    const [baseForms, setBaseForms] = useState([])
    const [forms, setForms] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedForm, setSelectedForm] = useState(null)
    const [isSelectionMode, setIsSelectionMode] = useState(false) // Modo de selección
    const [selectedForms, setSelectedForms] = useState([]) // Formularios seleccionados
    const [filter, selectedFilter] = useState(null)
    const [index, setSelectedIndex] = useState(null)
    const [range, setRange] = useState({})
    const [isRangeMode, setIsRangeMode] = useState(false)
    const [isLastsMode, setIsLastsMode] = useState(false)
    const [lasts, setLasts] = useState(0)
    
    const configuredDateService = new NativeDateService('en', {
        startDayOfWeek:1,
        format: 'DD/MM/YYYY'
      })

    const handleRange = () => {
        const startInt = range.startDate ? range.startDate.getTime() : null
        const endInt = range.endDate ? range.endDate.getTime() : null
        if(startInt){
            endInt ? setForms(baseForms.filter((data) => {
                return data.id >= startInt && data.id <= endInt + 86399999})) : setForms(baseForms.filter((data) => {
                return data.id >= startInt
            }))
         }
    }
    
    const filters = [
        {value:"Fecha ↓", func: () => {forms.sort((a,b) =>b.id - a.id)}},
        {value:"Fecha ↑", func: () => {forms.sort((a,b)=> a.id - b.id)}},
        {value: "Rango" , func: () => {setIsRangeMode(true)}},
        {value: "Ultimos", func: () => {setIsLastsMode(true)}}
    ]

    const fetchSavedForms = async () => {
        try {
            const savedForms = JSON.parse(await AsyncStorage.getItem('savedForms')) || []
            setBaseForms(savedForms)
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
            Alert.alert('Éxito', 'Formulario eliminado')
        } catch (error) {
            console.error('Error :', error)
            Alert.alert('Error', 'No se pudo eliminar el formulario')
        }
    }

    const exportForm = form => {
        const objectStringified = JSON.stringify(form)
        const filePath = `${FileSystem.cacheDirectory}response.json`
    
        // Intentar compartir usando un archivo temporal
        FileSystem.writeAsStringAsync(filePath, objectStringified).then( 
            () => Sharing.shareAsync(filePath, {
            dialogTitle: 'Compartir JSON como archivo',
            mimeType: 'application/json',
            UTI: 'public.json'
            })
        // Si se compartio correctamente
        ).then( 
            response => {
            if (response === Sharing.sharedAction) 
                Alert.alert('¡Compartido!', 'El archivo JSON se compartió correctamente')
            }
        // Si no se pudo compartir 
        ).catch(error => {
            console.error('Error al compartir:', error);
            Alert.alert('Error', 'Hubo un problema al intentar compartir el archivo')
        // Borrar el archivo temporal
        }).finally(
            async () => {
            try {
                const fileInfo = await FileSystem.getInfoAsync(filePath)
                if (fileInfo.exists) await FileSystem.deleteAsync(filePath)
            } catch (deleteError) {
                console.error('Error al eliminar el archivo:', deleteError)
            }
            }
        )
    }

    const deleteSelectedForms = async () => {
        try {
            const updatedForms = forms.filter(form => !selectedForms.includes(form.id))
            await AsyncStorage.setItem('savedForms', JSON.stringify(updatedForms))
            setForms(updatedForms)
            setSelectedForms([]) // Resetear formularios seleccionados
            setIsSelectionMode(false) // Salir del modo de selección
            Alert.alert('Éxito', 'Formularios eliminados')
        } catch (error) {
            console.error('Error :', error)
            Alert.alert('Error', 'No se pudo eliminar los formularios seleccionados')
        }
    }

    const openModal = (form) => {
        setSelectedForm(form)
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
        setSelectedForm(null)
    }

    useEffect(() => {
        fetchSavedForms()
    }, [])

    const BackIcon = () => (
        <Image
            source={require('../assets/arrow_back.png')}
            style={styles.backIcon}
        />
    )

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
    )

    const SelectionIcon = (props) => (
        <Icon name={isSelectionMode ? 'checkmark-square' : 'checkmark-square'} style={styles.backIcon} {...props} />
    )

    const SelectionAction = () => (
        <TopNavigationAction icon={SelectionIcon} onPress={toggleSelectionMode} />
    )

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode)
        setSelectedForms([]) // Resetear selección al activar/desactivar modo
    }

    const handleSelection = (id) => {
        if (isSelectionMode) {
            setSelectedForms(prev =>
                prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
            )
        } else {
            openModal(forms.find(form => form.id === id))
        }
    }

    const handleFilter = index => {
        const selectedItem = filters[index.row]
        setSelectedIndex(index)
        selectedFilter(selectedItem.value)
        const newForms = baseForms
        selectedItem.func(newForms)
        setForms(newForms)
    }
    const handleLasts = value => {
        setLasts(value)
        const newForms = baseForms
        newForms.sort((a,b) => a.id - b.id)
        setForms((newForms.slice(-value)).reverse())
    }

    const renderTitle = () => (
        <View style={styles.titleContainer}>
            <Text style={styles.title}>Formularios Guardados</Text>
        </View>
    )

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.containerBox,
                selectedForms.includes(item.id) && styles.selectedItem
            ]}
            onPress={() => handleSelection(item.id)}
            onLongPress={toggleSelectionMode}
        >
            <Text style={styles.formTitle}>{item.nombreFormulario}</Text>
            {isSelectionMode ? null : (
                <Button style={styles.button} onPress={() => deleteForm(item.id)} accessoryLeft={deleteIcon} />
            )}
        </TouchableOpacity>
    )

    return (
        <>
            <LinearGradient colors={['#29C9A2', '#A0ECA5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <TopNavigation
                    title={renderTitle}
                    style={styles.topNavigation}
                    accessoryLeft={BackAction}
                    accessoryRight={SelectionAction}
                    alignment='center'
                />
            </LinearGradient>
            <Divider />
            <View style={styles.container}>
                <Layout style = {{alignItems : 'flex-end', backgroundColor : '#f2f2f2'}}>
                <Select placeholder={'Filtro'} 
                        selectedIndex={index} 
                        style = {{width : '40%'}}
                        onSelect={handleFilter}
                        value={filter}>
                    {filters.map(item => (
                        <SelectItem key={item.value} title={item.value}/>
                    ))}
                </Select>
                {index && index.row === 2  ? <Text>{'Inicio: '+ (range.startDate ? configuredDateService.format(range.startDate) : '-') + ', Final: ' + (range.endDate ? configuredDateService.format(range.endDate): '-')}</Text> : <></>}
                {index && index.row === 3 ? <Input placeholder='¿Cuantas respuestas desea?' value={lasts} onChangeText={handleLasts} keyboardType='numeric'/> : <></>}
                </Layout>
                <FlatList
                    data={forms}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
                <Modal visible ={isRangeMode}>
                    <Layout style = {styles.containerCalendar}>
                        <RangeCalendar range={range} onSelect={nextrange => setRange(nextrange)}/>
                            <View style={{alignContent : 'row'}}>
                                <Button onPress={() => setIsRangeMode(false)}>Volver</Button>
                                <Button onPress={() => {setIsRangeMode(false)
                                                        handleRange()
                                }}>Confirmar</Button>        
                            </View>
                    </Layout>
                </Modal>
                {isSelectionMode && (
                    <Layout style={styles.buttonContainer}>
                        <Button style={styles.deleteButton} onPress={deleteSelectedForms} accessoryLeft={deleteIcon}>
                            Eliminar 
                        </Button>

                        <Button status='info' style={styles.shareButton} accessoryLeft={shareIcon} onPress={() => exportForm(
                            forms.filter(form => selectedForms.includes(form.id)))}>
                            Compartir
                        </Button>
                    </Layout>
                )}
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={closeModal}
                >
                    <Layout style={styles.modalContainer}>
                        <Card style={styles.modalCard} disabled={true} >
                            <Text style={styles.modalTitle}>{selectedForm?.nombreFormulario}</Text>
                            {selectedForm && Object.entries(selectedForm.data).map(([key, value]) => (
                                <Layout style={styles.containerRespuestas}>
                                    <Text style={styles.key} key={key}>{`${key}`}</Text>
                                    <Text style={styles.value}>{`${value}`}</Text>
                                </Layout>
                            ))}
                            <Button onPress={() => exportForm(selectedForm)}>Compartir</Button>
                            <Button status='danger' onPress={closeModal}>Cerrar</Button>
                        </Card>
                    </Layout>
                </Modal>
            </View>
        </>
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
    key:{
        fontWeight: 'bold',
        fontSize: 12,
        color: "#9e9e9e"
    },
    value: {
        fontSize: 18,
        color: "#9e9e9e",
    },
    listContainer: {
        paddingBottom: 100,
    },
    button: {
        margin: 2,
        paddingVertical: 5,
        paddingHorizontal: 5,
        fontWeight: 'bold',
        fontSize: 10,
    },
    formTitle: {
        fontSize: 18,
    },
    containerBox: {
        padding: 10,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#ffffff', 
        borderWidth: 1,
        borderColor: '#9beba5',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: "10%" },
        shadowOpacity: 0.9,
        shadowRadius: 2,
        elevation: 3,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    containerCalendar: {
        width: '100%',
        padding: 10,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#ffffff', 
        borderWidth: 1,
        borderColor: '#9beba5',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: "10%" },
        shadowOpacity: 0.9,
        shadowRadius: 2,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    containerRespuestas: {
        padding: 10,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#ffffff', 
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    selectedItem: {
        backgroundColor: '#BBDEFB',
        borderColor: '#79b2fc',
    },
    deleteButton: {
        width: '35%',
        marginRight: '3%'
    },
    shareButton: {
        width: '35%',
        marginLeft: '3%'
    },
    modalContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    modalCard: {
        borderRadius: 5,
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 16,
        fontWeight: 'bold'
    },
    topNavigation: {
        backgroundColor: 'transparent',
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
    buttonContainer: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        
        
    },
})

export default SavedForms
