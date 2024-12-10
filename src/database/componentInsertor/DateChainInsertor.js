import ChainInsertor from './ChainInsertor'

export default class DateChainInsertor extends ChainInsertor {
    insert(fieldObject) {
        if (fieldObject.type != 'fecha')
            return next && next.insert(fieldObject)

        this.db.runSync(
            'INSERT INTO fields (fk_filed, qr_refillable, fk_limitations, fk_format) VALUES (?,?,?,?)',
            [fieldObject.type, fieldObject.rellenarQR, fieldObject.fk_limitations, fieldObject.fk_format]
        )

    }
}
