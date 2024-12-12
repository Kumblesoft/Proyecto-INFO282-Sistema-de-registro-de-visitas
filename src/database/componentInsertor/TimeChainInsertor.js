import ChainInsertor from './ChainInsertor'

export default class TimeChainInsertor extends ChainInsertor {
    insert(fieldObject, formID) {
        if (fieldObject.type != 'hora')
            return next && next.insert(fieldObject)

        this.db.runSync(
            'INSERT INTO fields (fk_filed, qr_refillable, fk_limitations, fk_format) VALUES (?,?,?,?)',
            [fieldObject.type, fieldObject.rellenarQR, fieldObject.fk_limitations, fieldObject.fk_format]
        )

    }
}
