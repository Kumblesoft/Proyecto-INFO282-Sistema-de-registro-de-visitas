import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import Menu from "./screens/Menu";
import FormSelectorScreen from "./screens/FormSelectorScreen";
import FormFiller from "./screens/FormFiller";
import SavedForms from "./screens/SavedFormsScreen";
import { FormProvider } from './context/FormContext';
import { IdentifierProvider } from './context/IdentifierContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <NavigationContainer>
        <FormProvider>
          <IdentifierProvider>
            <Stack.Navigator initialRouteName="Menu">
              <Stack.Screen name="Menu" component={Menu} />
              <Stack.Screen name="FormSelector" component={FormSelectorScreen} />
              <Stack.Screen name="SavedForms" component={SavedForms} />
              <Stack.Screen name="FormFiller" component={FormFiller} />
            </Stack.Navigator>
          </IdentifierProvider>
        </FormProvider>
      </NavigationContainer>
    </ApplicationProvider>
  );
}
