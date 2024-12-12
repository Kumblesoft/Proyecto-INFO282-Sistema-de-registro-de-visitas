export default class ChainInsertor {
    constructor() {
        this.next = null
    }

    add(chainInsertor) {
        if (this.next != null)
            throw new Error("Se quiere sobreescribir una cadena ya formada")

        this.next = chainInsertor
        return this.next
    }

    insert(fieldObject, fieldId, fieldTypeId) {
        throw new Error('Este metodo no esta implementado')
    }
}
