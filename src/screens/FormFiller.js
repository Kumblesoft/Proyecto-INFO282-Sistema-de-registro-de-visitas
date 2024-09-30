import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Layout, Button, Text } from '@ui-kitten/components';
import DynamicForm from '../components/DynamicForm';

const FormFillerScreen = ({ route }) => {
  const { form } = route.params; // Datos del formulario pasado desde el FormSelector

    return (
        <Layout style={{ flex: 1, padding: 16 }}>
        <ScrollView>
            <Text category="h5">{form["nombre formulario"]}</Text>
            
            <View style={{ marginTop: 20 }}>
            <DynamicForm formData={form}/>
            </View>
            
            <View style={{ marginTop: 20 }}>
            </View>
        </ScrollView>
        </Layout>
    );
};

export default FormFillerScreen;
