import ChainInsertor from './ChainInsertor'


export default class RadioChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.tipo != 'radio')
            return this.next && this.next.insert(fieldObject, fieldId, fieldTypeId, fieldTableName)
        
        this.db.runSync(
            `INSERT INTO ${fieldTableName} (fk_field) VALUES (?)`,
            [fieldId]
        )
        const insertedRowId = this.db.getFirstSync('select last_insert_rowid() as id')

        fieldObject.opciones?.forEach(option =>
            this.db.runSync(
                `INSERT INTO radio_options (fk_radio_id, name, value) VALUES (?, ?, ?)`,
                [insertedRowId.id, option.nombre, option.valor]
            ))
        return true
    }

    delete(fieldId, fieldTableName, fieldTypeName) {
        if (fieldTypeName != 'radio')
            return this.next && this.next.delete(fieldId, fieldTableName, fieldTypeName)

        const id_options = this.db.getFirstSync(
            `SELECT id_options FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        ).id_options

        this.db.runSync(
            `DELETE FROM radio_options WHERE fk_radio_id = ?`,
            [id_options]
        )

        this.db.runSync(
            `DELETE FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        )
        return true
    }
    getFieldProperties(fieldId, fieldTableName, fieldTypeName) {
        if (fieldTypeName != 'radio')
            return this.next && this.next.getFieldProperties(fieldId, fieldTableName, fieldTypeName)

        const fieldProperties = this.db.getFirstSync(
            `SELECT id_options FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        )
        const optionsQuery = this.db.getAllSync(
            `SELECT name, value FROM radio_options WHERE fk_radio_id = ?`,
            [fieldProperties.id_options]
        )

        return {
            tipo: 'radio',
            opciones: optionsQuery.map(option => ({ nombre: option.name, valor: option.value }))
        }
    }
}
