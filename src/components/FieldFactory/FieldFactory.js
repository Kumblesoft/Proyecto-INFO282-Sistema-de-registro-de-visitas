import React from 'react'
import { Text } from '@ui-kitten/components'
import CreateField from './subcomponents/CreateField'

const FieldFactory = () => {
    return <>
        <Text category='s1'>Bienvenido al creador de plantillas :D</Text>
        <CreateField></CreateField>
    </>
}

export default FieldFactory