import ChainInsertor from './ChainInsertor'


export default class SelectorChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.type != 'selector')
            return next && next.insert(fieldObject)
        this.db.runSync(
            `INSERT INTO ${fieldTableName} (id_options, fk_field, default_option, selector_placeholder) VALUES (?,?,?,?)`,
            [fieldId, fieldObject["opcion predeterminada"], fieldObject["texto predeterminado"]]
        )

        const insertedRowId = this.db.getFirstSync('select last_insert_rowid() as id').id

        fieldObject.options?.forEach(option => 
            this.db.runSync(
                `INSERT INTO select_options (fk_selector_id, name, value) VALUES (?, ?, ?)`,
                [insertedRowId, option.nombre, option.valor]
        ))
        
    }
    delete(fieldId, fieldTableName) {

        const id_options = this.db.getFirstSync(
            `SELECT id_options FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        ).id_options

        this.db.runSync(
            'DELETE FROM select_options WHERE fk_selector_id IN (SELECT id FROM selector WHERE fk_field = ?)',
            [id_options]
        )

        this.db.runSync(
            `DELETE FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        )
    }
}
