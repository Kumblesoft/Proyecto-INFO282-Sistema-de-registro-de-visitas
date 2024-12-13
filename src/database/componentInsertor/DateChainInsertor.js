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
    getFieldProperties(fieldId, fieldTableName) {
        const properties =  this.db.getFirstSync(`SELECT date_format, default_date FROM ${fieldTableName} WHERE fk_field = ?`, [fieldId])
        return {
            formato: properties.date_format,
            "fecha predeterminada": properties.default_date
        }
    }
}
