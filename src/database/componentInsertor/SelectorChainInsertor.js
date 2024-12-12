import ChainInsertor from './ChainInsertor'

export default class SelectorChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.type != 'selector')
            return next && next.insert(fieldObject)

    }
}
