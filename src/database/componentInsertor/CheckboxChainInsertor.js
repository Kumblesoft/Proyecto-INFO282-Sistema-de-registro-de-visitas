import ChainInsertor from './ChainInsertor'


export default class CheckboxChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.tipo != 'checkbox')
            return this.next && this.next.insert(fieldObject, fieldId, fieldTypeId, fieldTableName)

        //console.log(fieldObject)
        this.db.runSync(
            `INSERT INTO ${fieldTableName} (fk_field, default_option, max_checked_options) VALUES (?,?,?)`,
            [fieldId, JSON.stringify(fieldObject["opcion predeterminada"]), fieldObject["cantidad de elecciones"]]
        )
        const insertedRowId = this.db.getFirstSync('select last_insert_rowid() as id')

        fieldObject.opciones?.forEach(option =>
            this.db.runSync(
                `INSERT INTO checkbox_options (fk_checkbox_id, name, value) VALUES (?, ?, ?)`,
                [insertedRowId.id, option.nombre, option.valor]
            ))
        return true
    }
    delete(fieldId, fieldTableName, fieldTypeName) {
        if (fieldTypeName != 'checkbox')
            return this.next && this.next.delete(fieldId, fieldTableName, fieldTypeName)

        const id_options = this.db.getFirstSync(
            `SELECT id_options FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        ).id_options

        this.db.runSync(
            `DELETE FROM checkbox_options WHERE fk_checkbox_id = ?`,
            [id_options]
        )

        this.db.runSync(
            `DELETE FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        )
        return true
    }
    getFieldProperties(fieldId, fieldTableName, fieldTypeName) {
        if (fieldTypeName != 'checkbox')
            return this.next && this.next.getFieldProperties(fieldId, fieldTableName, fieldTypeName)

        const fieldProperties = this.db.getFirstSync(
            `SELECT id_options, default_option, max_checked_options FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        )
        const optionsQuery = this.db.getAllSync(
            `SELECT name, value FROM checkbox_options WHERE fk_checkbox_id = ?`,
            [fieldProperties.id_options]
        )

        return {
            "opcion predeterminada": JSON.parse(fieldProperties.default_option),
            "cantidad de elecciones": fieldProperties.max_checked_options,
            opciones: optionsQuery.map(option => ({ nombre: option.name, valor: option.value }))
        }
    }
}
