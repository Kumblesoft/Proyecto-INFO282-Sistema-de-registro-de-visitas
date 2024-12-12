import ChainInsertor from './ChainInsertor'

export default class CameraChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId) {
        if (fieldObject.type != 'camara')
            return next && next.insert(fieldObject)

        this.db.runSync(
            'INSERT INTO camara(fk_field, aspect_relation) values (?,?)', 
            [fieldId, fieldObject.aspect_relation]
        )
    }
}
