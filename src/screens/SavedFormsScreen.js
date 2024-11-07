import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Alert, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal, Card, TopNavigation, TopNavigationAction, Divider, Layout, Button, Icon } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const deleteIcon = (props) => (
    <Icon name='trash' {...props} />
);

const SavedForms = () => {
    const navigation = useNavigation();
    const [forms, setForms] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedForm, setSelectedForm] = useState(null);
    const [isSelectionMode, setIsSelectionMode] = useState(false); // Modo de selección
    const [selectedForms, setSelectedForms] = useState([]); // Formularios seleccionados

    const fetchSavedForms = async () => {
        try {
            const savedForms = JSON.parse(await AsyncStorage.getItem('savedForms')) || [];
            setForms(savedForms);
        } catch (error) {
            console.error('Error :', error);
        }
    };

    const deleteForm = async (id) => {
        try {
            const updatedForms = forms.filter(form => form.id !== id);
            await AsyncStorage.setItem('savedForms', JSON.stringify(updatedForms));
            setForms(updatedForms);
            Alert.alert('Éxito', 'Formulario eliminado');
        } catch (error) {
            console.error('Error :', error);
            Alert.alert('Error', 'No se pudo eliminar el formulario');
        }
    };

    const deleteSelectedForms = async () => {
        try {
            const updatedForms = forms.filter(form => !selectedForms.includes(form.id));
            await AsyncStorage.setItem('savedForms', JSON.stringify(updatedForms));
            setForms(updatedForms);
            setSelectedForms([]); // Resetear formularios seleccionados
            setIsSelectionMode(false); // Salir del modo de selección
            Alert.alert('Éxito', 'Formularios eliminados');
        } catch (error) {
            console.error('Error :', error);
            Alert.alert('Error', 'No se pudo eliminar los formularios seleccionados');
        }
    };

    const openModal = (form) => {
        setSelectedForm(form);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedForm(null);
    };

    useEffect(() => {
        fetchSavedForms();
    }, []);

    const BackIcon = () => (
        <Image
            source={require('../assets/arrow_back.png')}
            style={styles.backIcon}
        />
    );

    const deleteIcon = (props) => (
        <Icon name='trash' {...props} />
    );
    
    const shareIcon = (props) => (
        <Icon name='share' {...props}/>
    );

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => navigation.goBack()} />
    );

    const SelectionIcon = (props) => (
        <Icon name={isSelectionMode ? 'checkmark-square' : 'checkmark-square'} {...props} />
    );

    const SelectionAction = () => (
        <TopNavigationAction icon={SelectionIcon} onPress={toggleSelectionMode} />
    );

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedForms([]); // Resetear selección al activar/desactivar modo
    };

    const handleSelection = (id) => {
        if (isSelectionMode) {
            setSelectedForms(prev =>
                prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
            );
        } else {
            openModal(forms.find(form => form.id === id));
        }
    };

    const renderTitle = () => (
        <View style={styles.titleContainer}>
            <Text style={styles.title}>Formularios Guardados</Text>
        </View>
    );

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
    );

    return (
        <>
            <LinearGradient colors={['#2dafb9', '#17b2b6', '#00b4b2', '#00b7ad', '#00b9a7', '#00bba0', '#00bd98', '#00bf8f', '#00c185', '#00c27b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
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
                <FlatList
                    data={forms}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
                {isSelectionMode && (
                    <Layout style={styles.buttonContainer}>
                        <Button style={styles.deleteButton} onPress={deleteSelectedForms} accessoryLeft={deleteIcon}>
                            Eliminar 
                        </Button>

                        <Button status='info' style={styles.shareButton} accessoryLeft={shareIcon}>
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
                        <Card style={styles.modalCard} disabled={true}>
                        <Text style={styles.modalTitle}>{selectedForm?.nombreFormulario}</Text>
                        {selectedForm && Object.entries(selectedForm.data).map(([key, value]) => (
                            <Layout style={styles.containerRespuestas} key={key}>
                                <Text style={styles.key}>{`${key}`}</Text>
                                <Text style={styles.value}>{`${value}`}</Text>
                            </Layout>
                        ))}
                        <Button style={styles.closeButton} status='info' onPress={closeModal}>Cerrar</Button>
                        </Card>
                    </Layout>
                </Modal>
            </View>
        </>
    );
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
    containerRespuestas: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
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
    shareButton: {
        width: '35%',
        marginLeft: '3%'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    modalCard: {
        alignSelf: 'center',
        width: '200%', 
        maxWidth: '250%', 
        borderRadius: 10,
        padding: 1, // Agrega algo de padding interno si es necesario
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
});

export default SavedForms;
