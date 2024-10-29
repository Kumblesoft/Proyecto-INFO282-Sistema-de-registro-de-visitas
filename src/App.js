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
import { Header } from "react-native/Libraries/NewAppScreen"
import {EvaIconsPack} from "@ui-kitten/eva-icons"

const myTheme = {
  ...eva.light, // Usamos el tema claro de Eva Design
  'color-primary-default': '#6ddb7c',  // Color principal (normal)
  'color-primary-active': '#4caf50',   // Color cuando se presiona el botón
  'color-primary-hover': '#81c784',    // Color cuando está en hover o toque
}

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
