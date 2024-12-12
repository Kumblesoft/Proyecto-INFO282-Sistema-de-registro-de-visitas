import ChainInsertor from './ChainInsertor'

export default class DateChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId) {
        if (fieldObject.type != 'fecha')
            return next && next.insert(fieldObject)

    }
}
