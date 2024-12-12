import ChainInsertor from './ChainInsertor'
import { useSQLiteContext } from 'expo-sqlite'

export default class TextChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        const formId = db.getFirstSync('SELECT id FROM forms WHERE name = ?', [formName]).id
        console.log(fieldObject)
        if (fieldObject.tipo != 'texto')
            return this?.next && this.next.insert(fieldObject)

        this.db.runSync(
            'INSERT INTO texto (fk_field, name, qr_refillable) VALUES (?,?,?)',
            [fieldId, fieldObject.nombre, fieldObject.rellenarQR]
        )

        fieldObject.limitaciones?.forEach((limitation) => {
            console.log(limitation)
            const limitationID = db.getFirstSync('SELECT id FROM limitations WHERE name = ?', [limitation]).id
            console.log(limitationID)
            db.runSync(
                'INSERT INTO limitations_intermediary (fk_forms, fk_fields, fk_limitations) VALUES (?,?,?)',
                [formID, fieldID, limitationID]
            )
        })

        fieldObject.formato?.forEach((format) => {
            console.log(format)
            const formatID = db.getFirstSync('SELECT id FROM format WHERE name = ?', [format]).id
            console.log(formatID)
            db.runSync(
                'INSERT INTO format_intermediary (fk_forms, fk_field,fk_format) VALUES (?,?,?)',
                [formId, fieldId, formatID]
            )
        })

        return true
    }
}
