import ChainInsertor from './ChainInsertor'

export default class DateChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.tipo != 'fecha')
            return this.next && this.next.insert(fieldObject, fieldId, fieldTypeId, fieldTableName)

        this.db.runSync(
            `INSERT INTO ${fieldTableName} (fk_field, date_format, default_date) VALUES (?,?,?)`,
            [fieldId, fieldObject.formato, fieldObject['fecha predeterminada']]
        )
        fieldObject.limitatciones?.forEach(limitation => {
            this.db.runSync(
                'INSERT INTO limitations_intermediary (fk_field, fk_limitation) VALUES (?,?)',
                [fieldId, this.db.getFirstSync('SELECT id FROM limitations WHERE name = ?', [limitation]).id]
            )
        })
        return true
        // Colocar formato.
    }
    delete(fieldId, fieldTableName, fieldTypeName) {
        if (fieldTypeName != 'fecha')
            return this.next && this.next.delete(fieldId, fieldTableName, fieldTypeName)

        this.db.runSync(
            `DELETE FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        )
        return true
    }
    getFieldProperties(fieldId, fieldTableName, fieldTypeName) {
        if (fieldTypeName != 'fecha')
            return this.next && this.next.getFieldProperties(fieldId, fieldTableName, fieldTypeName)
        const properties = this.db.getFirstSync(`SELECT date_format, default_date FROM ${fieldTableName} WHERE fk_field = ?`, [fieldId])
        const limitations = this.db.getAllSync(`SELECT fk_limitation FROM limitations_intermediary WHERE fk_field = ?`, [fieldId]).map(l => l.fk_limitation)
        const outputLimitations = []
        limitations.forEach(limitation => outputLimitations.push(this.db.getFirstSync(`SELECT name FROM limitations WHERE id = ?`, [limitation]).name))

        return {
            tipo: 'fecha',
            formato: properties.date_format,
            "fecha predeterminada": properties.default_date,
            limitaciones: outputLimitations
        }
    }
}
