import ChainInsertor from './ChainInsertor'

export default class CameraChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.type != 'camara')
            return next && next.insert(fieldObject)
        
        this.db.runSync(
            `INSERT INTO ${fieldTableName}(fk_field, aspect_relation) values (?,?)`, 
            [fieldId, fieldObject.aspect_relation.toString()]
        )
    }
}
