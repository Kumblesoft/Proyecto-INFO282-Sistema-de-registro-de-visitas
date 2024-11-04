import React from "react"
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components"
import * as eva from "@eva-design/eva"
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import Menu from "./screens/Menu"
import FormSelectorScreen from "./screens/FormSelectorScreen" // Importa tu pantalla de selección de formularios
import FormFiller from "./screens/FormFiller"
import SavedForms from "./screens/SavedFormsScreen"
import Settings from "./screens/Settings"
import { FormProvider } from './context/FormContext'

const myTheme = {
  ...eva.light, 
  'color-primary-default': '#6ddb7c',
  'color-primary-active': '#4caf50',
  'color-primary-hover': '#81c784',
  
  'color-info-default': '#2196F3',   // Azul normal
  'color-info-active': '#1976D2',    // Azul oscuro al presionar
  'color-info-hover': '#64B5F6',     // Azul claro en hover

  'color-danger-default': '#f44336',    // Rojo normal
  'color-danger-active': '#d32f2f',     // Rojo oscuro al presionar
  'color-danger-hover': '#e57373',      // Rojo claro en hover
};

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={myTheme}>
      <NavigationContainer>
        <FormProvider>
          <Stack.Navigator initialRouteName="Menu">
            <Stack.Screen name="Menu" component={Menu} options={{headerShown:false}}/>
            <Stack.Screen name="FormSelector" component={FormSelectorScreen} options={{headerShown:false}}/>
            <Stack.Screen name="SavedForms" component={SavedForms} options={{headerShown:false}}/>
            <Stack.Screen name="FormFiller" component={FormFiller} options={{headerShown:false}}/>
            <Stack.Screen name="Settings" component={Settings} options={{headerShown:false}}/>
          </Stack.Navigator>
        </FormProvider>
      </NavigationContainer>
    </ApplicationProvider>
    </>
  )
}
