import ChainInsertor from './ChainInsertor'

export default class TimeChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.tipo != 'hora')
            return this.next && this.next.insert(fieldObject, fieldId, fieldTypeId, fieldTableName)
        this.db.runSync(
            `INSERT INTO ${fieldTableName} (fk_field, default_time) VALUES (?,?)`,
            [fieldId, fieldObject['hora predeterminada']]
        )
        fieldObject.limitatciones?.forEach(limitation => {
            this.db.runSync(
                'INSERT INTO limitations_intermediary (fk_field, fk_limitation) VALUES (?,?)',
                [fieldId, this.db.getFirstSync('SELECT id FROM limitations WHERE name = ?', [limitation]).id]
            )
        })
        return true
    }
    delete(fieldId, fieldTableName, fieldTypeName) {
        if (fieldTypeName != 'hora')
            return this.next && this.next.delete(fieldId, fieldTableName, fieldTypeName)
        this.db.runSync(
            `DELETE FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        )
        return true
    }
    getFieldProperties(fieldId, fieldTableName, fieldTypeName) {
        if (fieldTypeName != 'hora')
            return this.next && this.next.getFieldProperties(fieldId, fieldTableName, fieldTypeName)

        const limitations = this.db.getAllSync(`SELECT fk_limitation FROM limitations_intermediary WHERE fk_field = ?`, [fieldId]).map(l => l.fk_limitation)
        const outputLimitations = []
        limitations.forEach(limitation => outputLimitations.push(this.db.getFirstSync(`SELECT name FROM limitations WHERE id = ?`, [limitation]).name))

        return {
            "hora predeterminada": this.db.getFirstSync(`SELECT default_time FROM ${fieldTableName} WHERE fk_field = ?`, [fieldId]).default_time,
            limitaciones: outputLimitations
        }
    }
}
//Prueba
