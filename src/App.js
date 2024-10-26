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
import { FormProvider } from './context/FormContext'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <FormProvider>
            <Stack.Navigator initialRouteName="Menu">
              <Stack.Screen name="Menu" component={Menu} />
              <Stack.Screen name="FormSelector" component={FormSelectorScreen} />
              <Stack.Screen name="SavedForms" component={SavedForms} />
              <Stack.Screen name="FormFiller" component={FormFiller} />
            </Stack.Navigator>
          </FormProvider>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  )
}