import ChainInsertor from './ChainInsertor'

export default class DateChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.tipo != 'fecha')
            return this.next && this.next.insert(fieldObject, fieldId, fieldTypeId, fieldTableName)

        this.db.runSync(
            `INSERT INTO ${fieldTableName} (fk_field, date_format, default_date) VALUES (?,?,?)`,
            [fieldId, fieldObject.formato, fieldObject['fecha predeterminada']]
        )
        return true
        // Colocar formato.
    }
    delete(fieldId, fieldTableName) {
        this.db.runSync(
            `DELETE FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        )
    }
}
