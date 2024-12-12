import ChainInsertor from './ChainInsertor'


export default class CheckboxChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.tipo != 'checkbox')
            return this.next && this.next.insert(fieldObject, fieldId, fieldTypeId, fieldTableName)

        //console.log(fieldObject)
        this.db.runSync(
            `INSERT INTO ${fieldTableName} (fk_field, default_option, max_checked_options) VALUES (?,?,?)`,
            [fieldId, fieldObject["opcion predeterminada"].toString(), fieldObject["cantidad de elecciones"]]
        )
        const insertedRowId = this.db.getFirstSync('select last_insert_rowid() as id')

        fieldObject.options?.forEach(option => 
            this.db.runSync(
                `INSERT INTO select_options (fk_selector_id, name, value) VALUES (?, ?, ?)`,
                [insertedRowId.id, option.nombre, option.valor]
        ))
        return true
    }
    delete(fieldId, fieldTableName) {

        const id_options = this.db.getFirstSync(
            `SELECT id_options FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        ).id_options

        this.db.runSync(
            'DELETE FROM checkbox_options WHERE fk_selector_id IN (SELECT id FROM checkbox WHERE fk_field = ?)',
            [id_options]
        )

        this.db.runSync(
            `DELETE FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        )
    }
}
