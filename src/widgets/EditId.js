import React, { useState } from 'react'
import { Layout, Input, Button, Text, Modal, Card } from '@ui-kitten/components'
import * as SecureStore from 'expo-secure-store'
import { useIdentifierContext } from '../context/IdentifierContext'
import { StyleSheet } from 'react-native'

export const IDInputComponent = () => {
  const [id, setId] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isIDChanged, setIsIDChanged] = useState(false)
  const { identifier, setIdentifier, originalIdentifier } = useIdentifierContext()

  const handleSave = async () => {
    try {
      await setIdentifier(id) // Guarda el nuevo ID como el último en SecureStore
      await setIsIDChanged(true)
      setIsEditing(false)
    } catch (error) {
      console.error("Error al guardar el ID en SecureStore:", error)
    }
  }

  const handleEdit = () => {
    setId(identifier) // Carga el ID actual en el input para editar
    setIsEditing(true)
  }

  const handleRestore = async () => {
    try {
      await SecureStore.setItemAsync('last_deviceid', originalIdentifier) // Restaurar el identificador original
      setIdentifier(originalIdentifier)
    } catch (error) {
      console.error("Error al restaurar el ID original en SecureStore:", error)
    }
  }

  return (
    <>
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text category="h5">Modificar ID</Text>

        {isEditing ? (
          <>
            <Input
              placeholder="Ingresa el ID"
              value={id}
              onChangeText={setId}
              style={{ marginVertical: 10, width: '100%' }}
            />
            <Button onPress={handleSave} style={{ marginVertical: 10 }}>
              Guardar
            </Button>
          </>
        ) : (
          <>
            <Text category="p1">ID : {identifier || "No hay un ID guardado."}</Text>
            <Button onPress={handleEdit} style={{ marginVertical: 10 }}>
              Editar
            </Button>

            {identifier !== originalIdentifier && (
              <Button onPress={handleRestore} style={{ marginVertical: 10 }}>
                Restaurar Identificador
              </Button>
            )}
          </>
        )}
      </Layout>
      {isIDChanged && (
        <Modal
          visible={isIDChanged}
          onBackdropPress={() => setIsIDChanged(false)}
          style={styles.changeIDWindowModal}
          animationType='slide'
        >
          <Card disabled={true} style={{ borderRadius: 10 }}>
            <Button onPress={() => setIsIDChanged(false)}>
              <Text>
                DISMISS
              </Text>
            </Button>
          </Card>
        </Modal>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  changeIDWindowModal: {
    margin: 0,
    justifyContent: 'flex-end',
  }
})
