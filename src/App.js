import React from "react"
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components"
import * as eva from "@eva-design/eva"
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import Menu from "./screens/Menu"
import FormSelectorScreen from "./screens/FormSelectorScreen" // Importa tu pantalla de selección de formularios
import CreateTemplate from './screens/CreateTemplate'
import FormFiller from "./screens/FormFiller"
import SavedForms from "./screens/SavedFormsScreen"
import Settings from "./screens/Settings"
import { SQLiteProvider, useSQLiteContext, SQLiteDatabase } from 'expo-sqlite'
import { initializeDataBase } from './database/database'

import { FormProvider } from './context/SelectedFormContext'
import { IdentifierProvider } from './context/IdentifierContext'
import FormEditor from './screens/FormEditor'


const myTheme = {
  ...eva.light,
  'color-primary-default': '#00e798',
  'color-primary-active': '#00c17f',
  'color-primary-hover': '#60e0b5',

  'color-info-default': '#2196F3',
  'color-info-active': '#1976D2',
  'color-info-hover': '#64B5F6',

  'color-danger-default': '#f44336',
  'color-danger-active': '#d32f2f',
  'color-danger-hover': '#e57373',

  'color-gray-default': '#9e9e9e',
  'color-gray-active': '#757575',
  'color-gray-hover': '#bdbdbd',

  'color-basic-default': '#e0e0e0',  // Fondo del toggle apagado
  'color-basic-active': '#bdbdbd',   // Fondo al presionar
  'color-basic-hover': '#f5f5f5',    // Fondo en hover

  'color-custom-default': '#00b7ae',
  'color-custom-active': '#009f8d',
  'color-custom-hover': '#33bfa6',

  'color-control-default': '#ffffff',   // Color de fondo del interruptor
  'color-control-active': '#e0e0e0',   // Fondo al presionar
  'color-control-hover': '#f5f5f5',    // Fondo en hover

}


const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <SQLiteProvider databaseName="forms.db" onInit={initializeDataBase}>
        <ApplicationProvider {...eva} theme={myTheme}>
          <NavigationContainer>
            <FormProvider>
              <IdentifierProvider>
                <Stack.Navigator initialRouteName="Menu">
                  <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
                  <Stack.Screen name="FormSelector" component={FormSelectorScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="SavedForms" component={SavedForms} options={{ headerShown: false }} />
                  <Stack.Screen name="FormFiller" component={FormFiller} options={{ headerShown: false }} />
                  <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
                  <Stack.Screen name="FormEditor" component={FormEditor} options={{ headerShown: false }} />
                </Stack.Navigator>
              </IdentifierProvider>
            </FormProvider>
          </NavigationContainer>
        </ApplicationProvider>
      </SQLiteProvider>
    </>
  )
}
