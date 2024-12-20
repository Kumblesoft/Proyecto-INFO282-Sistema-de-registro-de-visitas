import React, { useState } from 'react'
import { Layout, Icon,  Button, Text, Modal, Card, Divider} from '@ui-kitten/components'
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
        <Button status='danger' style={{ marginVertical: 10 }} onPress={() => setIsResetting(true)}> Reiniciar </Button>
        
      </Layout>
      {isResetting && (
        <Modal
          visible={isResetting}
          onBackdropPress={() => setIsResetting(false)}
          style={styles.changeIDWindowModal}
          animationType='slide'
          backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <Card disabled={true} style={{ borderRadius: 10 }}>
            <View style={styles.header}>
                <Text category='h5' style={{flex:1, textAlign: 'center'}}>Atención</Text>
            </View>
            <Divider/>
            <Text category='h6' style={{flex:1, textAlign:'center', padding:10, color:'gray'}} >
                ¿Desea reiniciar la <Text category='h6'>base de datos</Text>?</Text>
            <Text style={{fontWeight: 'bold', textAlign: 'center'}}>Esta acción no se puede deshacer.</Text>
            <Layout style={styles.buttonContainer}>
              <Button style={{ flex: 1, marginRight: '10%' }} status='info' onPress={() => setIsResetting(false)}
                accessoryLeft={props => <Icon name='close-outline' {...props} />}>
                No
              </Button>
              <Button style={{ flex: 1, marginLeft: '10%' }} status='danger' onPress={() => {
                    resetDatabase(db)
                    setIsResetting(false)
                    Alert.alert('Base de datos reiniciada, exitosamente')
                }}
                accessoryLeft={props => <Icon name='checkmark-outline' {...props} />}
                >
                Sí
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
