import ChainInsertor from './ChainInsertor'
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite'

export default class TextChainInsertor extends ChainInsertor {
    insert(fieldObject) {
        if (fieldObject.type != 'texto')
            return next && next.insert(fieldObject)
        db = useSQLiteContext()


        db.runSync(
            'INSERT INTO fields (fk_filed, qr_refillable, fk_limitations, fk_format) VALUES (?,?,?,?)',
            [fieldObject.type, fieldObject.rellenarQR, fieldObject.fk_limitations, fieldObject.fk_format]
        )

    }
}
