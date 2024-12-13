import ChainInsertor from './ChainInsertor'

export default class TimeChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.tipo != 'hora')
            return this.next && this.next.insert(fieldObject, fieldId, fieldTypeId, fieldTableName)
        this.db.runSync(
            `INSERT INTO ${fieldTableName} (fk_field, default_time) VALUES (?,?)`,
            [fieldId, fieldObject['hora predeterminada']]
        )
        return true
    }
    delete(fieldId, fieldTableName, fieldTypeName) {
        if (fieldTypeName != 'hora')
            return this.next && this.next.delete(fieldId, fieldTableName, fieldTypeName)
        this.db.runSync(
            `DELETE FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        )
    }
    getFieldProperties(fieldId, fieldTableName, fieldTypeName) {
        if (fieldTypeName != 'hora')
            return this.next && this.next.getFieldProperties(fieldId, fieldTableName, fieldTypeName)
        return {
            "hora predeterminada": this.db.getFirstSync(`SELECT default_time FROM ${fieldTableName} WHERE fk_field = ?`,[fieldId])
        }
    }
}
//Prueba
