import ChainInsertor from './ChainInsertor'

export default class DateChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.type != 'fecha')
            return next && next.insert(fieldObject)

    }
}
