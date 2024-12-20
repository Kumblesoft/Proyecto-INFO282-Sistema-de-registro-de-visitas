import React, { useState } from 'react'
import { Layout, Input, Button, Text, Modal, Card} from '@ui-kitten/components'
import * as SecureStore from 'expo-secure-store'
import { useIdentifierContext } from '../context/IdentifierContext'
import { Alert, StyleSheet, View } from 'react-native'
import { useSQLiteContext } from 'expo-sqlite'
import { getDatabaseInstance } from '../database/database'
import { resetDatabase } from '../database/database'

export const ResetDBComponent = () => {
    const db = getDatabaseInstance(useSQLiteContext())
    const [isResetting, setIsResetting] = useState(false)
    

  return (
    <>
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text category="h5">Reiniciar base de datos</Text>
        <Button style={{ marginVertical: 10 }} onPress={() => setIsResetting(true)}> Resetear </Button>
        
      </Layout>
      {isResetting && (
        <Modal
          visible={isResetting}
          onBackdropPress={() => setIsResetting(false)}
          style={styles.changeIDWindowModal}
          animationType='slide'
        >
          <Card disabled={true} style={{ borderRadius: 10 }}>
            <Text>¿Desea reiniciar la base de datos?</Text>
            <Text style={{fontWeight: 'bold'}}>Esta acción no se puede deshacer.</Text>
            <Layout style={styles.buttonContainer}>
              <Button style={{ flex: 1, marginRight: '10%' }} status='danger' onPress={() => {
                    resetDatabase(db)
                    setIsResetting(false)
                    Alert.alert('Base de datos reiniciada, exitosamente')
                }}>
                Sí
              </Button>
              <Button style={{ flex: 1, marginLeft: '10%' }} onPress={() => setIsResetting(false)}>
                No
              </Button>
            </Layout>
          </Card>
        </Modal>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  changeIDWindowModal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
})
export default ResetDBComponent
