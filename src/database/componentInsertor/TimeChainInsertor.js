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
    delete(fieldId, fieldTableName) {
        this.db.runSync(
            `DELETE FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        )
    }
}
//Prueba
