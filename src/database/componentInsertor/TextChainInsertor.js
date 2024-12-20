import ChainInsertor from './ChainInsertor'


export default class TextChainInsertor extends ChainInsertor {
    insert(fieldObject, fieldId, fieldTypeId, fieldTableName) {
        if (fieldObject.tipo != 'texto')
            return this.next && this.next.insert(fieldObject, fieldId, fieldTypeId, fieldTableName)

        this.db.runSync(
            'INSERT INTO text_properties (fk_field, qr_refillable, is_required) VALUES (?,?,?)',
            [fieldId, fieldObject.rellenarQR, fieldObject.obligatorio]
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

    delete(fieldId, fieldTableName, fieldTypeName) {
        if (fieldTypeName != 'texto')
            return this.next && this.next.delete(fieldId, fieldTableName, fieldTypeName)

        const id_formats = this.db.getFirstSync(`SELECT id_formats FROM ${fieldTableName} WHERE fk_field = ?`, [fieldId]).id_formats

        this.db.runSync(
            'DELETE FROM is_formatted WHERE fk_id_text = ?',
            [id_formats]
        )

        this.db.runSync(
            'DELETE FROM limitations_intermediary WHERE fk_field = ?',
            [fieldId]
        )

        this.db.runSync(
            `DELETE FROM ${fieldTableName} WHERE fk_field = ?`,
            [fieldId]
        )

        return true
    }

    getFieldProperties(fieldId, fieldTableName, fieldTypeName) {
        if (fieldTypeName != 'texto')
            return this.next && this.next.getFieldProperties(fieldId, fieldTableName, fieldTypeName)

        const properties = this.db.getFirstSync(
            `SELECT id_formats, qr_refillable, is_required FROM ${fieldTableName} WHERE fk_field = ?`,
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
            tipo: 'texto',
            rellenarQR: Boolean(properties.qr_refillable),
            obligatorio: !!properties.is_required,
            limitaciones: limitations.map(limitation => limitation.name),
            formato: format.map(format => format.name)
        }
    }

}
