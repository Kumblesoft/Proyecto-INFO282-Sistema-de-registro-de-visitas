import React from 'react'
import { StyleSheet, View } from 'react-native'
import CameraConfiguration, { Camera } from './components/Camera'

const App = () => {
  // Configuration object for the Camera component
  const cameraConfiguration = new CameraConfiguration()

  return (
    <View style={styles.container}>
      <Camera cameraConfiguration={cameraConfiguration} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
