import TextChainInsertor from './componentInsertor/TextChainInsertor'
import SelectorChainInsertor from './componentInsertor/SelectorChainInsertor'
import DateChainInsertor from './componentInsertor/DateChainInsertor'
import TimeChainInsertor from './componentInsertor/TimeChainInsertor'
import CameraChainInsertor from './componentInsertor/CameraChainInsertor'
import CheckboxChainInsertor from './componentInsertor/CheckboxChainInsertor'
import RadiusChainInsertor from './componentInsertor/RadiusChainInsertor'
import initDatabaseScript from './tables'

const { dbInit } = initDatabaseScript
const tables = ['forms', 'fields', 'field_table_name', 'text_properties', 'selector_properties', 'checkbox_properties', 'radio_properties', 'date_properties', 'hour_properties', 'camera_properties', 'limitations',
    'limitations_intermediary', 'format', 'selector_options', 'radio_options', 'checkbox_options', 'compatibility_matrix', 'respuestas', 'campo_respuesta']
const table_types = [['text_properties', 'texto'], ['selector_properties', 'selector'], ['date_properties', 'fecha'], ['hour_properties', 'hora'], ['camera_properties', 'camara']]

/**
 * Guarda si dos elementos son compatibles
 * @param {Number} firstElement "Primer elemento de la matriz de compatibilidad"
 * @param {Number} secondElement "Segundo elemento de la matriz de compatibilidad"
 * @param {String} typenameOfField ""Nombre del tipo de campo"
 * @param {boolean} isCompatible "Indica si los elementos son compatibles, true si lo son, false si no"
 * @param {[Number]} isFormat "1 si es formato, 0 si es limitacion"
 */
export const setCompatibility = (db, firstElement, secondElement, typenameOfField, isCompatible, isFormat) => {
    if (firstElement == secondElement) return 'Ok'
    if (firstElement > secondElement) secondElement = [firstElement, firstElement = secondElement][0]

    const fieldTypeId = db.getFirstSync('SELECT id FROM field_table_name WHERE field_type_name = ?', [typenameOfField]).id
    if (isCompatible)
        return db.runSync('INSERT INTO compatibility_matrix (fila, columna, fk_field_type_id, limitation_or_format) VALUES (?,?,?,?)', [firstElement, secondElement, fieldTypeId, isFormat])
    return db.runSync('DELETE FROM compatibility_matrix WHERE fila = ? AND columna = ? AND fk_field_type_id = ? AND limitation_or_format = ?', [firstElement, secondElement, fieldTypeId, isFormat])
}

export async function initializeDataBase(db) {
    try {
        tables.forEach(table =>
            db.runSync(`DROP TABLE IF EXISTS ${table}`))
        db.execSync(dbInit)
        console.log('Database initialized')
    } catch (error) {
        console.log(error)
    }

    table_types.forEach(type =>
        db.runSync('INSERT INTO field_table_name (table_name, field_type_name) VALUES (?,?)', type)
    )

    db.runSync('INSERT INTO limitations (name, regex, value_enum_matrix) VALUES (?,?,?)', ["solo letras", "((/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/))", 0])
    db.runSync('INSERT INTO limitations (name, regex, value_enum_matrix) VALUES (?,?,?)', ["solo numeros", "/^-?\d+([.,]\d+)?$/", 1])
    db.runSync('INSERT INTO limitations (name, regex, value_enum_matrix) VALUES (?,?,?)', ["solo enteros", "/^-?\d+$/", 2])
    db.runSync('INSERT INTO limitations (name, regex, value_enum_matrix) VALUES (?,?,?)', ["solo enteros positivos y cero", "/^\d+$/", 3])
    db.runSync('INSERT INTO limitations (name, regex, value_enum_matrix) VALUES (?,?,?)', ["email", "/^(([^<>()[\]\.,:\s@\"]+(\.[^<>()[\]\.,:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,:\s@\"]+\.)+[^<>()[\]\.,:\s@\"]{2,})$/i", 4])
    db.runSync('INSERT INTO limitations (name, regex, value_enum_matrix) VALUES (?,?,?)', ["no numeros", "/^[^\d]*$/", 5])
    db.runSync('INSERT INTO limitations (name, value_enum_matrix) VALUES (?,?)', ["editable", 0])
    db.runSync('INSERT INTO limitations (name, value_enum_matrix) VALUES (?,?)', ["no editable", 1])

        ;[[1, 2], [1, 3], [2, 3], [3, 4]].forEach(pair => setCompatibility(db, pair[0], pair[1], "texto", 1, 0))
}

// Singleton factory method to get the instance
let instance = null

export function getDatabaseInstance(db) {
    if (!instance) {
        instance = new Database(db)
    }
    return instance
}

export default class Database {
    constructor(db) {
        if (Database.instance) {
            return Database.instance // Return the existing instance if it already exists
        }

        this.db = db
        this.chainInsertors = new TextChainInsertor(this.db)
        this.chainInsertors
            .add(new SelectorChainInsertor(this.db))
            .add(new DateChainInsertor(this.db))
            .add(new TimeChainInsertor(this.db))
            .add(new CameraChainInsertor(this.db))
            .add(new CheckboxChainInsertor(this.db))
            .add(new RadiusChainInsertor(this.db))

        Database.instance = this // Cache the instance
    }

    getForms() {

        try {
            tables.forEach(table =>
                console.log(`${table}:\n${JSON.stringify(this.db.getAllSync(`SELECT * FROM ${table}`))}`)
            )
        } catch (error) {
            console.log(error)
        }
    }

    addForm(newForm) {
        try {
            const statement = this.db.prepareSync('INSERT INTO forms (name, last_modification) VALUES (?,?)')
            statement.executeSync([newForm["nombre formulario"], newForm["ultima modificacion"]])
            const formID = this.db.getFirstSync('select last_insert_rowid() as id').id

            newForm.campos.forEach((fieldObject, i) => {
                const { id: typeOfField, table_name: fieldTableName } = this.db.getFirstSync('SELECT id, table_name FROM field_table_name WHERE field_type_name=?', [fieldObject.tipo])

                this.db.runSync(
                    'INSERT INTO fields (fk_id_form, fk_field_table_name, name, ordering, obligatory, output) VALUES (?,?,?,?,?,?)',
                    [formID, typeOfField, fieldObject.nombre, i, fieldObject.obligatorio, fieldObject.salida]
                )
                const lastFieldId = this.db.getFirstSync('SELECT id FROM fields ORDER BY id DESC LIMIT 1').id
                if (!this.chainInsertors.insert(fieldObject, lastFieldId, typeOfField, fieldTableName)) throw new Error('Error al insertar')
            })
            //this.getForms()
        } catch (error) {
            console.log(error)
        }
    }

    async deleteForm(formID) {
        try {
            const fieldsID = this.db.getAllSync('SELECT id FROM fields WHERE fk_id_form = ?', [formID])
            fieldsID.forEach(field => {
                const fieldTableName = this.db.getFirstSync('SELECT table_name FROM field_table_name WHERE id = ?', [field.fk_field_table_name]).table_name
                if (!this.chainInsertors.delete(field.id, fieldTableName)) throw new Error('Error al eliminar')
                this.db.runSync('DELETE FROM fields WHERE id = ?', [field.id])
            })
            this.db.runSync('DELETE FROM forms WHERE id = ?', [formID])
            this.getForms()
        } catch (error) {
            console.log(error)
        }
    }

    /* async updateForm(formName, formObject) {
        try {
            const statement = this.db.prepareSync('UPDATE forms SET name = ?, output_file_name = ?, last_modification = ? WHERE name = ?')
            const id = statement.executeSync([form["nombre formulario"], newForm["nombre archivo salida"], newForm["ultima modificacion"]]).getFirstSync().id
            form.fields.forEach((fieldObject, i) => {
                this.db.runSync(
                    'INSERT INTO fields (fk_id_form, fk_field_table_name, name, order, obligatory, output) VALUES (?,?,?,?,?,?)',
                    [id, this.getComponnentTypeId(field.tipo), field.nombre, i, field.obligatorio, field.salida]
                )
                if (!this.chainInsertors.insert(fieldObject)) throw new Error('Error al insertar')
            })
            this.getForms()
        } catch (error) {
            console.log(error)
        }

        try {
            const statement = this.db.prepareSync('UPDATE forms SET name = ?, output_file_name = ?, last_modification = ?  WHERE id = ?')
            statement.executeSync([(form.name, form.output_file_name, form.last_modification, id])
            this.getForms()
        } catch (error) {
            console.log(error)
        }
    } */

    getComponnentTypeId(fieldType) {
        return this.db.getFirstSync('SELECT id FROM field_table_name WHERE field = ?', [fieldType]).id
    }
}
