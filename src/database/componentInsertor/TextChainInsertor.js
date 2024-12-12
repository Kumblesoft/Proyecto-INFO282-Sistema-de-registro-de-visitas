import ChainInsertor from './ChainInsertor'
import { useSQLiteContext } from 'expo-sqlite'

export default class TextChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        console.log(fieldObject)
        if (fieldObject.tipo != 'texto')
            return this?.next && this.next.insert(fieldObject)

        this.db.runSync(
            'INSERT INTO texto (fk_field, qr_refillable) VALUES (?,?,?)',
            [fieldId, fieldObject.rellenarQR]
        )

        fieldObject.limitaciones?.forEach((limitation) => {
            console.log(limitation)
            const limitationID = db.getFirstSync('SELECT id FROM limitations WHERE name = ?', [limitation]).id
            console.log(limitationID)
            db.runSync(
                'INSERT INTO limitations_intermediary (fk_fields, fk_limitations) VALUES (?,?,?)',
                [fieldId, limitationID]
            )
        })

        fieldObject.formato?.forEach((format) => {
            console.log(format)
            const formatID = db.getFirstSync('SELECT id FROM format WHERE name = ?', [format]).id
            console.log(formatID)
            db.runSync(
                'INSERT INTO format_intermediary (fk_field,fk_format) VALUES (?,?,?)',
                [fieldId, formatID]
            )
        })

        return true
    }
}
