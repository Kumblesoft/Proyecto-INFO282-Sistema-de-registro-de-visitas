import ChainInsertor from './ChainInsertor'

export default class SelectorChainInsertor extends ChainInsertor {
    insert(fieldObject) {
        if (fieldObject.type != 'selector')
            return next && next.insert(fieldObject)

        this.db.runSync(
            'INSERT INTO fields (fk_filed, qr_refillable, fk_limitations, fk_format) VALUES (?,?,?,?)',
            [fieldObject.type, fieldObject.rellenarQR, fieldObject.fk_limitations, fieldObject.fk_format]
        )

    }
}
