import React from "react"
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ApplicationProvider } from "@ui-kitten/components"
import * as eva from "@eva-design/eva"
import Menu from "./screens/Menu"
import FormSelectorScreen from "./screens/FormSelectorScreen" // Importa tu pantalla de selección de formularios
import { FormProvider } from './context/FormContext'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <NavigationContainer>
        <FormProvider>
          <Stack.Navigator initialRouteName="Menu">
            <Stack.Screen name="Menu" component={Menu} />
            <Stack.Screen name="FormSelector" component={FormSelectorScreen} />
          </Stack.Navigator>
        </FormProvider>
      </NavigationContainer>
    </ApplicationProvider>
  )
}