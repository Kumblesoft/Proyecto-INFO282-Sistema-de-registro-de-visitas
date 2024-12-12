export default class ChainInsertor {
    constructor(db) {
        this.next = null
        this.db = db
    }

    add(chainInsertor) {
        if (this.next != null)
            throw new Error("Se quiere sobreescribir una cadena ya formada")

        this.next = chainInsertor
        return this.next
    }

    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        throw new Error('Este metodo no esta implementado')
    }

    delete(fieldId, fieldTableName) {
        throw new Error('Este metodo no esta implementado')
    }
}
