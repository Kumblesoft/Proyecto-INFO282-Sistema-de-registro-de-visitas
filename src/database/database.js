import TextChainInsertor from './componentInsertor/TextChainInsertor'
import SelectorChainInsertor from './componentInsertor/SelectorChainInsertor'
import DateChainInsertor from './componentInsertor/DateChainInsertor'
import TimeChainInsertor from './componentInsertor/TimeChainInsertor'
import CameraChainInsertor from './componentInsertor/CameraChainInsertor'
import initDatabaseScript from './tables'

const { dbInit } = initDatabaseScript
const tables = ['forms', 'fields', 'field_table_name', 'text_properties', 'selector_properties', 'date_properties', 'hour_properties', 'camera_properties', 'limitations', 'limitations_intermediary', 'format', 'format_intermediary', 'options', 'compatibility_matrix']
const table_types = [['text_properties', 'texto'], ['selector_properties', 'selector'], ['date_properties', 'fecha'], ['hour_properties', 'hora'], ['camera_properties', 'camara']]

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
        db.runSync('INSERT INTO field_table_name (table_name, field_type_name) VALUES (?)', type)
    )


    db.runSync('INSERT INTO limitations (name, regex, value_enum_matrix) VALUES (?,?,?)', ["solo letras", "((/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/))", 0])
    db.runSync('INSERT INTO limitations (name, regex, value_enum_matrix) VALUES (?,?,?)', ["solo numeros", "/^-?\d+([.,]\d+)?$/", 1])
    db.runSync('INSERT INTO limitations (name, regex, value_enum_matrix) VALUES (?,?,?)', ["solo enteros", "/^-?\d+$/", 2])
    db.runSync('INSERT INTO limitations (name, regex, value_enum_matrix) VALUES (?,?,?)', ["solo enteros positivos y cero", "/^\d+$/", 3])
    db.runSync('INSERT INTO limitations (name, regex, value_enum_matrix) VALUES (?,?,?)', ["email", "/^(([^<>()[\]\.,:\s@\"]+(\.[^<>()[\]\.,:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,:\s@\"]+\.)+[^<>()[\]\.,:\s@\"]{2,})$/i", 4])
    db.runSync('INSERT INTO limitations (name, regex, value_enum_matrix) VALUES (?,?,?)', ["no numeros", "/^[^\d]*$/", 5])
    db.runSync('INSERT INTO limitations (name, value_enum_matrix) VALUES (?,?)', ["editable", 0])
    db.runSync('INSERT INTO limitations (name, value_enum_matrix) VALUES (?,?)', ["no editable", 1])

    db.runSync('INSERT INTO format (name, value_enum_matrix) VALUES (?,?)', ["solo mayusculas", 0])
    db.runSync('INSERT INTO format (name, value_enum_matrix) VALUES (?,?)', ["solo minusculas", 1])
    db.runSync('INSERT INTO format (name, value_enum_matrix) VALUES (?,?)', ["dd/mm/yyyy", 0])
    db.runSync('INSERT INTO format (name, value_enum_matrix) VALUES (?,?)', ["mm/dd/yyyy", 1])
    db.runSync('INSERT INTO format (name, value_enum_matrix) VALUES (?,?)', ["yyyy/mm/dd", 2])
    db.runSync('INSERT INTO format (name, value_enum_matrix) VALUES (?,?)', ["yyyy/dd/mm", 3])
    db.runSync('INSERT INTO format (name, value_enum_matrix) VALUES (?,?)', ["mm/yyyy/dd", 4])
    db.runSync('INSERT INTO format (name, value_enum_matrix) VALUES (?,?)', ["dd/yyyy/mm", 5])

    db.runSync('INSERT INTO compatibility_matrix (fila, columna, fk_field_table_name, limitation_or_format) VALUES (?,?,?,?)', [1, 2, "texto", 0])
    db.runSync('INSERT INTO compatibility_matrix (fila, columna, fk_field_table_name, limitation_or_format) VALUES (?,?,?,?)', [1, 3, "texto", 0])
    db.runSync('INSERT INTO compatibility_matrix (fila, columna, fk_field_table_name, limitation_or_format) VALUES (?,?,?,?)', [2, 3, "texto", 0])
    db.runSync('INSERT INTO compatibility_matrix (fila, columna, fk_field_table_name, limitation_or_format) VALUES (?,?,?,?)', [3, 4, "texto", 0])

    db.runSync('INSERT INTO compatibility_matrix (fila, columna, fk_field_table_name, limitation_or_format) VALUES (?,?,?,?)', [1, 1, "texto", 1])
    db.runSync('INSERT INTO compatibility_matrix (fila, columna, fk_field_table_name, limitation_or_format) VALUES (?,?,?,?)', [2, 2, "texto", 1])

    db.runSync('INSERT INTO compatibility_matrix (fila, columna, fk_field_table_name, limitation_or_format) VALUES (?,?,?,?)', [1, 1, "fecha", 0])
    db.runSync('INSERT INTO compatibility_matrix (fila, columna, fk_field_table_name, limitation_or_format) VALUES (?,?,?,?)', [2, 2, "fecha", 0])

    db.runSync('INSERT INTO compatibility_matrix (fila, columna, fk_field_table_name, limitation_or_format) VALUES (?,?,?,?)', [1, 1, "hora", 0])
    db.runSync('INSERT INTO compatibility_matrix (fila, columna, fk_field_table_name, limitation_or_format) VALUES (?,?,?,?)', [2, 2, "hora", 0])
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
        Database.instance = this // Cache the instance
        this.chainInsertors = new TextChainInsertor()
        this.chainInsertors
            .add(new SelectorChainInsertor())
            .add(new DateChainInsertor())
            .add(new TimeChainInsertor())
            .add(new CameraChainInsertor())
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
            const statement = this.db.prepareSync('INSERT INTO forms (name, output_file_name, last_modification) VALUES (?,?,?)')
            statement.executeSync([newForm["nombre formulario"], newForm["nombre archivo salida"], newForm["ultima modificacion"]])
            const formID = this.db.getFirstSync('SELECT id FROM forms WHERE name = ?', [newForm["nombre formulario"]]).id
            const typeOfField = this.getComponnentTypeId(fieldObject.tipo)
            newForm.campos.forEach((fieldObject, i) => {
                this.db.runSync(
                    'INSERT INTO fields (fk_id_form, fk_field_table_name, name, ordering, obligatory, output) VALUES (?,?,?,?,?,?)',
                    [formID, typeOfField, fieldObject.nombre, i, fieldObject.obligatorio, fieldObject.salida]
                )
                const lastFieldId = this.db.getFirstSync('SELECT id FROM fields ORDER BY id DESC LIMIT 1').id
                if (!this.chainInsertors.insert(fieldObject, lastFieldId, typeOfField)) throw new Error('Error al insertar')
            })
            this.getForms()
        } catch (error) {
            console.log(error)
        }
    }

    async deleteForm(id) {
        try {
            this.db.runSync('DELETE FROM forms WHERE id = ?', [id])
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
