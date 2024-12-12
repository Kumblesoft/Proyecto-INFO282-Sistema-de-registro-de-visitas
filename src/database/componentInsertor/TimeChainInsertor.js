import ChainInsertor from './ChainInsertor'

export default class TimeChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.type != 'hora')
            return next && next.insert(fieldObject)
        this.db.runSync(
            `INSERT INTO ${fieldTableName} (fk_field, default_time) VALUES (?,?,?)`,
            [fieldId, fieldObject['hora predeterminada']]
        )
    }
    delete(fieldId, fieldTableName) {
        this.db.runSync(
            `DELETE FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        )
    }
}
//Prueba
