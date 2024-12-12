import ChainInsertor from './ChainInsertor'

export default class DateChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.type != 'fecha')
            return next && next.insert(fieldObject)

        this.db.runSync(
            `INSERT INTO ${fieldTableName} (fk_field, date_format, default_date) VALUES (?,?,?)`,
            [fieldId, fieldObject.formato, fieldObject['fecha predeterminada']]
        )

        // Colocar formato.
    }
    delete(fieldId, fieldTableName) {
        this.db.runSync(
            `DELETE FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        )
    }
}
