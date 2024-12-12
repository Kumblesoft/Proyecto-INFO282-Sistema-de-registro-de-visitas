import ChainInsertor from './ChainInsertor'


export default class CheckboxChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.type != 'checkbox')
            return next && next.insert(fieldObject)
        this.db.runSync(
            `INSERT INTO ${fieldTableName} (fk_field, default_option, max_checked_options) VALUES (?,?,?,?)`,
            [fieldId, fieldObject["opcion predeterminada"], fieldObject["cantidad de elecciones"]]
        )
    }
}
