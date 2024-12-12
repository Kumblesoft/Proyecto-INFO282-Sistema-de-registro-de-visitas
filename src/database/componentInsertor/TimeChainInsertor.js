import ChainInsertor from './ChainInsertor'

export default class TimeChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId) {
        if (fieldObject.type != 'hora')
            return next && next.insert(fieldObject)

    }
}
