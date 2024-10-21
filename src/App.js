import React from "react"
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ApplicationProvider } from "@ui-kitten/components"
import * as eva from "@eva-design/eva"
import Menu from "./screens/Menu"
import FormSelectorScreen from "./screens/FormSelectorScreen" // Importa tu pantalla de selección de formularios
import FormFiller from "./screens/FormFiller"
import SavedForms from "./screens/SavedFormsScreen"
import { FormProvider } from './context/FormContext'
import { Header } from "react-native/Libraries/NewAppScreen"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <NavigationContainer>
        <FormProvider>
          <Stack.Navigator initialRouteName="Menu">
            <Stack.Screen name="Menu" component={Menu} options={{headerShown:false}}/>
            <Stack.Screen name="FormSelector" component={FormSelectorScreen} options={{headerShown:false}}/>
            <Stack.Screen name="SavedForms" component={SavedForms} options={{headerShown:false}}/>
            <Stack.Screen name="FormFiller" component={FormFiller} options={{headerShown:false}} />
          </Stack.Navigator>
        </FormProvider>
      </NavigationContainer>
    </ApplicationProvider>
  )
}