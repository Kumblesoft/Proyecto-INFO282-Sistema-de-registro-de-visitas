import ChainInsertor from './ChainInsertor'


export default class RadiusChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.type != 'radio')
            return next && next.insert(fieldObject)
        this.db.runSync(
            `INSERT INTO ${fieldTableName} (fk_field, default_option) VALUES (?,?,?,?)`,
            [ fieldId, fieldObject["opcion predeterminada"]]
        )
        const insertedRowId = this.db.getFirstSync('select last_insert_rowid() as id').id

        fieldObject.options?.forEach(option => 
            this.db.runSync(
                `INSERT INTO select_options (fk_selector_id, name, value) VALUES (?, ?, ?)`,
                [insertedRowId, option.nombre, option.valor]
        ))
    }
}
