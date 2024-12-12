import React, { useEffect, useState } from 'react'
import { Platform, Dimensions, StyleSheet, View, Text, FlatList, Alert, TouchableOpacity, Image, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Menu, MenuItem, Modal, Card, TopNavigation, TopNavigationAction, Divider, Layout, Button, Icon, Select, SelectItem, RangeCalendar, NativeDateService, Input } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import shareTypes from '../commonStructures/shareTypes'
import * as FileSystem from 'expo-file-system' 
import * as Sharing from 'expo-sharing'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getDatabaseInstance } from '../database/database'
import { useSQLiteContext } from 'expo-sqlite'

const { height } = Dimensions.get('window')
const { width } = Dimensions.get('window')



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
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [lasts, setLasts] = useState(0)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [expandedTypes, setExpandedTypes] = useState({});
    const [visible, setVisible] = useState(false);

    
    const database = getDatabaseInstance(useSQLiteContext())

    const optionBar = () => (
        <Layout style={styles.iconContainer}>
            <TopNavigationAction icon={SelectionIcon} onPress={toggleSelectionMode} />
            <TopNavigationAction icon={filterIcon} onPress={() => setFilterVisible(true)}/>
        </Layout>
    )
    
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
        {value:"Fecha ↓", func: () => forms.sort((a,b) =>b.id - a.id)},
        {value:"Fecha ↑", func: () => forms.sort((a,b)=> a.id - b.id)},
        {value: "Rango" , func: () => setIsRangeMode(true)},
        {value: "Ultimos", func: () => setIsLastsMode(true)}
    ]

    const fetchSavedForms = async () => {
        try {
            const savedForms = database.getAllAnswers() || []
            console.log(JSON.stringify(savedForms))
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
            fetchSavedForms()
        } catch (error) {
            console.error('Error :', error)
            Alert.alert('Error', 'No se pudo eliminar el formulario')
        }
    }

    const exportForm = form => {
        const filePath = `${FileSystem.cacheDirectory}respuestasFormularios.json`
        const copy = form.map(({id, ...form}) => form)

        const objectStringified = form.lenght === 1 ? JSON.stringify({ 
            share_content_type: shareTypes.SINGLE_ANSWER,
            content           : copy 
          }) : JSON.stringify({
            share_content_type: shareTypes.MULTIPLE_ANSWERS,
            content           : copy
        })
        
    
        // Intentar compartir usando un archivo temporal
        FileSystem.writeAsStringAsync(filePath, objectStringified).then( 
            () => Sharing.shareAsync(filePath, {
                dialogTitle : 'Compartir JSON como archivo',
                mimeType    : 'application/json',
                UTI         : 'public.json'
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
            fetchSavedForms()
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
        setSelectedForms([])
    }

    useEffect(() => {
        fetchSavedForms()
    }, [])

    const BackIcon = (props) => (
        <Icon
            name='arrow-ios-back-outline'
            style={styles.backIcon}
            fill='#fff'
            {...props}
        />
    )

    const deleteIcon = (props) => (
        <Icon name='trash' {...props} />
    );
    
    const shareIcon = (props) => (
        <Icon name='share' {...props}/>
    );

    const filterIcon = (props) => (
        <Icon name='funnel-outline' fill="#fff" {...props}/>
    );

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
    )

    const SelectionIcon = (props) => (
        <Icon fill='#fff' name={isSelectionMode ? 'checkmark-square' : 'checkmark-square'} style={styles.backIcon} {...props} />
    )

    const selectAll = () => setSelectedForms(forms.map(form => form.id))
    const deselectAll = () => setSelectedForms([])

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode)
        setSelectedForms([]) // Resetear selección al activar/desactivar modo
    }

    const handleSelection = id => {
        if (isSelectionMode) {
            setSelectedForms(prev =>
                prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
            )
        } else {
            setSelectedForms([id])
            openModal(forms.find(form => form.id === id))
        }
    }

    const handleFilter = (index) => {
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
        newForms.sort((a,b) => b.id - a.id)
        setForms(newForms.slice(newForms.length - value))
    }
    function isBase64(str) {
        if (!str || str.constructor !== String || str.length < 5000) {
            return false
        } 
      
        const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
        
        // Check if string length is a multiple of 4 and matches the Base64 pattern
        return str.length % 4 === 0 && base64Regex.test(str);
    }

    const renderTitle = () => (
        <View style={styles.titleContainer}>
            <Text style={styles.topNavigationText}>Formularios Guardados</Text>
        </View>
    )
    const groupedForms = forms.reduce((acc, form) => {
        if (!acc[form.plantilla]) 
            acc[form.plantilla] = []
        acc[form.plantilla].push(form)
        return acc
    }, {})
    
    const renderFormItem = ({ item }) => {
        const dateString = `${new Date(item.fecha)}`	
        const lenght = dateString.length

        return(
        <TouchableOpacity
            style={[
                styles.containerBox,
                selectedForms.includes(item.id) && styles.selectedItem
            ]}
            onPress={() => handleSelection(item.id)}
            onLongPress={toggleSelectionMode}
        >
            <Text style={styles.formTitle}>{dateString.substring(0, lenght-8 )}</Text>
            {isSelectionMode ? null : (
                <Button style={styles.button} onPress={() => exportForm([item])} accessoryLeft={shareIcon} />
            )}
        </TouchableOpacity>
    )}

    const toggleExpand = (type) => {
        setExpandedTypes(prevState => ({
            ...prevState,
            [type]: !prevState[type]
        }))
    }

    const renderTypeItem = ({ item }) => (
        <View>
            <TouchableOpacity onPress={() => toggleExpand(item)} >
                <Text style={styles.formType}>{item}</Text> {/* Mostrar el tipo de formulario */}
            </TouchableOpacity>
            {expandedTypes[item] && (
                <FlatList
                    data={groupedForms[item]}
                    renderItem={renderFormItem}
                    keyExtractor={form => form.fecha.toString()}
                />
            )}
        </View>
    )


    return (
        <>
            <SafeAreaView style={styles.safeArea}>
                <LinearGradient colors={['#2dafb9', '#17b2b6', '#00b4b2', '#00b7ad', '#00b9a7', '#00bba0', '#00bd98', '#00bf8f', '#00c185', '#00c27b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <TopNavigation
                        title={renderTitle}
                        style={styles.topNavigation}
                        accessoryLeft={BackAction}
                        accessoryRight={optionBar}
                        alignment='center'
                    />
                </LinearGradient>
            </SafeAreaView>
            
            <View style={styles.container}>
                <Layout style = {{alignItems : 'flex-end', backgroundColor : '#f2f2f2'}}>
                {isFilterVisible && (
                    <Modal 
                        visible={isFilterVisible} 
                        onBackdropPress={() => setFilterVisible(false)}
                        style={styles.filterWindowModal} 
                        animationType='slide'
                    >
                        <Card disabled={true} style={{width: width, borderRadius: 10}}>
                            <Menu>
                            {filters.map((item, index) => (
                                item && item.value ? (
                                    <MenuItem 
                                        key={item.value} 
                                        title={item.value} 
                                        onPress={() => handleFilter({row: index})} // Pasa un objeto con el índice
                                    />
                                ) : null
                            ))}
                            </Menu>
                            <Button onPress={() => setFilterVisible(false)}>
                                <Text>
                                    DISMISS
                                </Text>
                            </Button>
                        </Card>
                    </Modal>
                )}
                
                {index && index.row === 2  ? 
                    <Layout style={styles.buttonDateStyle}>
                        <Text style={styles.textDateStyle}>
                            {'Inicio: '+ (range.startDate ? configuredDateService.format(range.startDate) : '-') + ', Final: ' + (range.endDate ? configuredDateService.format(range.endDate): '-')}
                        </Text>
                    </Layout> : <></>
                }
                {index && index.row === 3 ? <Input style={styles.inputUltimos} placeholder='¿Cuantas respuestas desea?' value={lasts} OnChange={handleLasts} keyboardType='numeric'/> : <></>}
                {isSelectionMode && (
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, paddingTop: 10}}>
                        <Button onPress={deselectAll} accessoryLeft={deleteIcon} style ={{width: '40%', marginRight: '10%'}}>
                            <Text>
                                Limpiar selección
                            </Text>
                        </Button>
                        <Button onPress={selectAll} accessoryLeft={SelectionIcon} style={{width: '40%', marginLeft: "10%"}}>
                            <Text>
                                Seleccionar todo
                            </Text>    
                        </Button>
                    </View>
                )}
                </Layout>
                <FlatList
                    data={Object.keys(groupedForms)}
                    renderItem={renderTypeItem}
                    keyExtractor={item => item}
                    contentContainerStyle={styles.listContainer}
                />
                <Modal visible={isRangeMode}>
                    <Layout style = {styles.containerCalendar}>
                        <RangeCalendar range={range} onSelect={nextrange => setRange(nextrange)}/>
                            <View style={styles.buttonRangeContainer}>
                                <Button style={{marginRight: "3%"}} status='info' onPress={() => setIsRangeMode(false)}><Text>Volver</Text></Button>
                                <Button style={{marginLeft: "3%"}} 
                                    onPress={() => {
                                        setIsRangeMode(false)
                                        handleRange()
                                }}>
                                    <Text>
                                        Confirmar
                                    </Text>
                                </Button>        
                            </View>
                    </Layout>
                </Modal>
                <Modal visible ={confirmDelete[0]}>
                    <Layout style = {styles.container}>
                        <Text>¿Está seguro que desea eliminar el/los formulario?</Text>
                        <Layout style={styles.buttonContainer}>
                        <Button accessoryLeft={deleteIcon} 
                            status='danger' 
                            style={styles.deleteButton} 
                            onPress={() => {
                                deleteSelectedForms()
                                setConfirmDelete([false,false])
                            }}>
                                <Text>
                                    Eliminar
                                </Text>
                            </Button>
                        <Button 
                            accessoryLeft={BackIcon}
                            style={styles.deleteButton} 
                            onPress={() => confirmDelete[1] ? (setConfirmDelete([false,false]), setModalVisible(true)) : setConfirmDelete([false,false])}>
                                <Text>
                                    Cancelar
                                </Text>
                            </Button>
                        </Layout>
                    </Layout>
                </Modal>
                
                {isSelectionMode && (
                    <Layout style={styles.buttonContainer}>
                        <Button status='danger' style={styles.deleteButton} onPress={() => setConfirmDelete([true,false])} accessoryLeft={deleteIcon}>
                            <Text>
                                Eliminar 
                            </Text>
                        </Button>
                        <Button status='info' style={styles.shareButton} accessoryLeft={shareIcon} onPress={() => exportForm(
                            forms.filter(form => selectedForms.includes(form.id)))}>
                            <Text>
                                Compartir
                            </Text>
                        </Button>
                    </Layout>
                )}
            
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    onRequestClose={closeModal}
                    backdropStyle={styles.backdrop}
                >
                    <Layout style={styles.modalContainer}>
                        <Card style={styles.modalCard} disabled={true} >
                            <ScrollView style={{maxHeight: height * 0.8}} nestedScrollEnabled = {true} >
                            <Text style={styles.modalTitle}>{selectedForm?.plantilla}</Text>
                            {selectedForm && Object.entries(selectedForm.data).map(([key, value]) => (
                                <Layout style={styles.containerRespuestas}>
                                    <Text style={styles.key} key={key}>{`${key}`}</Text>
                                    <ScrollView style = {{maxHeight: 200}}>
                                        {
                                            isBase64(value) ?
                                            <Image source={{uri: `data:image/jpeg;base64,${value}`}} style={{width: 300, height: 300 }} resizeMode='center'/> :
                                            <Text style={styles.value}>{`${value}`}</Text>
                                        }
                                    </ScrollView>
                                </Layout>
                            ))}
                            
                                <Button accessoryLeft={deleteIcon} status='danger' onPress={() => {setConfirmDelete([true, true]); setModalVisible(false)}}>
                                    <Text>
                                        Eliminar
                                    </Text>   
                                </Button>
                                <Button accessoryLeft={shareIcon} status='info' onPress={() => exportForm([selectedForm])}>
                                    <Text>
                                        Compartir
                                    </Text>
                                </Button>
                                <Button  onPress={closeModal}>
                                    <Text>
                                        Cerrar
                                    </Text>    
                                </Button>
                            </ScrollView>
                        </Card>
                    </Layout>
                </Modal>
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    inputUltimos: {
        marginBottom: "3%",
        backgroundColor: '#ededed',
        color: '#7D7D7D',
        borderColor: '#D1D1D1', 
    },
    buttonDateStyle: {
        backgroundColor: '#ededed', 
        borderRadius: 6, 
        padding: "2%",
        marginTop: "3%",
        marginBottom: "3%",
        borderWidth: 1, 
        borderColor: '#D1D1D1',  
        alignItems: 'center',
        alignSelf: 'start',
    },
    textDateStyle: {
        color: '#7D7D7D', 
        fontWeight: '500', 
        textAlign: 'center',  
    },
    filterWindowModal: {
        margin: 0,  
        height: height,  
        justifyContent: 'flex-end',
    },
    safeArea: {
        backgroundColor: '#00baa4'
    },
    iconContainer: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    topNavigationText:{
        marginRight: Platform.OS == "ios" ? 50 : 50,
        fontSize: Platform.OS == "ios" ? 22: 22,   
        fontWeight: 'bold',
        color: '#fff',
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    containerBox: {
        padding: 10,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#ffffff', 
        borderWidth: 1,
        borderColor: '#00b7ae',
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
        alignItems: 'flex-start',
        flexDirection: 'column',
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: '1%',
        backgroundColor: '#f5f5f5',
        borderRadius: 8, 
    },
    selectedItem: {
        backgroundColor: '#BBDEFB',
        borderColor: '#79b2fc',
    },
    deleteButton: {
        width: '35%',
        marginRight: '3%'
    },
    closeButton: {
        width: '18%',
        marginLeft: '3%'
    },
    shareButton: {
        width: '35%',
        marginLeft: '3%'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        zIndex : 10
    },
    modalCard: {
        alignSelf: 'center',
        width: '100%', 
        maxWidth: '100%', 
        borderRadius: 10,
        minWidth: '90%'
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 32,
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
    formType: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
    },
    buttonRangeContainer: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginBottom: "2%",
        marginTop: "2%",
    },
})

export default SavedForms
