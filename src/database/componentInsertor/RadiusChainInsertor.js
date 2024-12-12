import ChainInsertor from './ChainInsertor'


export default class RadiusChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.type != 'radio')
            return next && next.insert(fieldObject)
        this.db.runSync(
            `INSERT INTO ${fieldTableName} (fk_field, default_option) VALUES (?,?,?,?)`,
            [ fieldId, fieldObject["opcion predeterminada"]]
        )
    }
}
