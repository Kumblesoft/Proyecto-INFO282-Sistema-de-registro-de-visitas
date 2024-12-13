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
        const idTextInserted = this.db.getFirstSync('SELECT last_insert_rowid() as id').id

        fieldObject.limitaciones?.forEach(limitation => {
            const limitationID = this.db.getFirstSync('SELECT id FROM limitations WHERE name = ?', [limitation]).id
            this.db.runSync(
                'INSERT INTO limitations_intermediary (fk_field, fk_limitation) VALUES (?,?)',
                [fieldId, limitationID]
            )
        })

        fieldObject.formato?.forEach((format) => {
            const formatID = this.db.getFirstSync('SELECT id_format FROM format WHERE name = ?', [format]).id_format
            this.db.runSync(
                'INSERT INTO is_formatted (fk_id_format,fk_id_text) VALUES (?,?)',
                [formatID, idTextInserted]
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

    getFieldProperties(fieldId, fieldTableName) {
        const properties = this.db.getFirstSync(
            `SELECT id_formats, qr_refillable FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        )
        const limitations = this.db.getAllSync(
            `SELECT name FROM limitations WHERE id IN (SELECT fk_limitation FROM limitations_intermediary WHERE fk_field = ?)`,
            [fieldId]
        )
        const format = this.db.getAllSync(
            `SELECT name FROM format WHERE id_format IN (SELECT fk_id_format FROM is_formatted WHERE fk_id_text = ?)`,
            [properties.id_formats]
        )
        return {
            rellenarQR      : properties.qr_refillable,
            limitaciones    : limitations.map(limitation => limitation.name),
            formato         : format.map(format => format.name)
        }
    }

}
