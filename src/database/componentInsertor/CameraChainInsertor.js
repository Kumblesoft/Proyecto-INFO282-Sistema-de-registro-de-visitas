import ChainInsertor from './ChainInsertor'

export default class CameraChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.tipo != 'camara')
            return this.next && this.next.insert(fieldObject, fieldId, fieldTypeId, fieldTableName)
        this.db.runSync(
            `INSERT INTO ${fieldTableName}(fk_field, aspect_relation) values (?,?)`,
            [fieldId, fieldObject['relacion de aspecto'].toString()]
        )
        return true
    }

    getFieldProperties(fieldId, fieldTableName, fieldTypeName) {
        if (fieldTypeName != 'camara')
            return this.next && this.next.getFieldProperties(fieldId, fieldTableName, fieldTypeName)
        return {
            "relacion de aspecto": this.db.getFirstSync(`SELECT aspect_relation FROM ${fieldTableName} WHERE fk_field = ?`, [fieldId])
        }
    }
    delete(fieldId, fieldTableName, fieldTypeName) {
        if (fieldTypeName != 'camara')
            return this.next && this.next.delete(fieldId, fieldTableName, fieldTypeName)
        this.db.runSync(
            `DELETE FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        )
    }
}
