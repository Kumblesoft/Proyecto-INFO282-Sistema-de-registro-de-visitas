import ChainInsertor from './ChainInsertor'


export default class SelectorChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.type != 'selector')
            return next && next.insert(fieldObject)
        this.db.runSync(
            `INSERT INTO ${fieldTableName} (id_options, fk_field, default_option, selector_placeholder) VALUES (?,?,?,?)`,
            [fieldId, fieldObject["opcion predeterminada"], fieldObject["texto predeterminado"]]
        )
    }
}
