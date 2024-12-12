import ChainInsertor from './ChainInsertor'

export default class DateChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.type != 'fecha')
            return next && next.insert(fieldObject)

        this.db.runSync(
            `INSERT INTO ${fieldTableName} (fk_field, name, default_date) VALUES (?,?,?)`,
            [fieldId, fieldObject.nombre, fieldObject.default_date]
        )
        // Colocar formato.
    }
}
