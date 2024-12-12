import ChainInsertor from './ChainInsertor'
import { useSQLiteContext } from 'expo-sqlite'

export default class TextChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.tipo != 'texto')
            return this.next && this.next.insert(fieldObject, fieldId, fieldTypeId, fieldTableName)

        this.db.runSync(
            'INSERT INTO text_properties (fk_field, qr_refillable) VALUES (?,?)',
            [fieldId, fieldObject.rellenarQR]
        )

        fieldObject.limitaciones?.forEach((limitation) => {
            console.log(limitation)
            const limitationID = this.db.getFirstSync('SELECT id FROM limitations WHERE name = ?', [limitation]).id
            console.log(limitationID)
            this.db.runSync(
                'INSERT INTO limitations_intermediary (fk_field, fk_limitations) VALUES (?,?)',
                [fieldId, limitationID]
            )
        })

        fieldObject.formato?.forEach((format) => {
            console.log(format)
            const formatID = this.db.getFirstSync('SELECT id FROM format WHERE name = ?', [format]).id
            console.log(formatID)
            this.db.runSync(
                'INSERT INTO is_formatted (fk_id_format,fk_id_text) VALUES (?,?)',
                [fieldId, formatID]
            )
        })

        return true
    }

    delete(fieldId, fieldTableName) {
        
        const id_formats = this.db.getFirstSync(`select id_formats from ${fieldTableName} where fk_field = ?`, [fieldId]).id_formats
        
        this.db.runSync(
            'DELETE FROM text_properties WHERE fk_field = ?',
            [fieldId]
        )

        this.db.runSync(
            'DELETE FROM limitations_intermediary WHERE fk_fields = ?',
            [fieldId]
        )

        this.db.runSync(
            'DELETE FROM format_intermediary WHERE fk_field = ?',
            [id_formats]
        )
    }

}
