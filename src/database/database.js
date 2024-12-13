import TextChainInsertor from './componentInsertor/TextChainInsertor'
import SelectorChainInsertor from './componentInsertor/SelectorChainInsertor'
import DateChainInsertor from './componentInsertor/DateChainInsertor'
import TimeChainInsertor from './componentInsertor/TimeChainInsertor'
import CameraChainInsertor from './componentInsertor/CameraChainInsertor'
import CheckboxChainInsertor from './componentInsertor/CheckboxChainInsertor'
import RadioChainInsertor from './componentInsertor/RadiusChainInsertor'
import initDatabaseScript from './tables'
import { useSQLiteContext } from 'expo-sqlite'


const { dbInit } = initDatabaseScript
const tables = ['forms', 'fields', 'field_table_name', 'text_properties', 'selector_properties', 'checkbox_properties', 'radio_properties', 'date_properties', 'hour_properties', 'camera_properties', 'limitations',
    'format', 'is_formatted', 'limitations_intermediary', 'selector_options', 'radio_options', 'checkbox_options', 'compatibility_matrix', 'respuestas', 'campo_respuesta']
const table_types = [['text_properties', 'texto'], ['selector_properties', 'selector'], ['checkbox_properties', 'checkbox'], ['radio_properties', 'radio'], ['date_properties', 'fecha'], ['hour_properties', 'hora'], ['camera_properties', 'camara']]

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

    db.runSync('INSERT INTO format (name, value_enum_matrix) VALUES (?,?)', ["solo minusculas", 1])
    db.runSync('INSERT INTO format (name, value_enum_matrix) VALUES (?,?)', ["solo mayusculas", 0])

        ;[[1, 2], [1, 3], [2, 3]].forEach(pair => setCompatibility(db, pair[0], pair[1], "texto", 1, 0))


}

// Singleton factory method to get the instance
let instance = null


export function getDatabaseInstance(db) {
    if (!instance) {
        instance = new Database(db)
        const testFroms = require('../TestForms/forms.json')
        testFroms.forEach(test => instance.addForm(test))
        //instance.getForm("Formulario 1")
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
            .add(new RadioChainInsertor(this.db))

        Database.instance = this // Cache the instance
    }

    getAllForms() {
        try {
            const forms = this.db.getAllSync('SELECT name FROM forms')
            return forms.map(form => this.getForm(form.name))
        } catch (error) {
            console.log(error)
        }
    }

    getForm(nombreFormulario) {
        try {
            const { id: formID, last_modification: ultimaModificacion } = this.db.getFirstSync('SELECT id,last_modification FROM forms WHERE name = ?', [nombreFormulario])
            const fields = this.db.getAllSync('SELECT id,fk_field_table_name,name,ordering,obligatory,output FROM fields WHERE fk_id_form = ?', [formID])

            const outputForm = {
                "nombre formulario": nombreFormulario,
                "ultima modificacion": ultimaModificacion
            }

            const outputFields = new Array(fields.length)
            fields.forEach((field) => {
                const { id: fieldID, fk_field_table_name: typeID, name: fieldName, ordering: posicion, obligatory: obligatorio, output: salidaCampo } = field
                const outputField = {
                    "nombre": fieldName,
                    "salida": salidaCampo,
                    "obligatorio": obligatorio,
                    "tipo": this.db.getFirstSync('SELECT field_type_name FROM field_table_name WHERE id = ?', [typeID]).field_type_name
                }

                const { table_name: typeTableName, field_type_name: fieldTypeName } = this.db.getFirstSync('SELECT table_name,field_type_name FROM field_table_name WHERE id = ?', [typeID])
                const outputTypeFieldData = this.chainInsertors.getFieldProperties(fieldID, typeTableName, fieldTypeName)
                Object.entries(outputTypeFieldData).forEach(([key, value]) =>
                    outputField[key] = value
                )

                outputFields[posicion] = outputField
            })
            outputForm.campos = outputFields

            return outputForm

        } catch (error) {
            console.log(error)
        }
    }

    getAllAnswers() {
        try {
            const answers = this.db.getAllSync('SELECT ID_RESPUESTA FROM respuestas')
            return answers.map(answer => this.getAnswer(answer['ID_RESPUESTA']))
        } catch (error) {
            console.log(error)
        }
    }
    getAnswerFromFormTemplate(formName) {
        try {
            const answers = this.db.getAllSync('SELECT id FROM forms WHERE name = ?', [formName])
            return answers.map(answer => this.getAnswer(answer['ID_RESPUESTA']))
        } catch (error) {
            console.log(error)
        }
    }
    getAnswer(idRespuesta) {
        try {
            const answer = this.db.getFirstSync('SELECT * FROM respuestas WHERE ID_RESPUESTA = ?', [idRespuesta])
            const fields = this.db.getAllSync('select ENUM_TIPO_CAMPO, NOMBRE_CAMPO, VALOR_CAMPO from CAMPO_RESPUESTA where id_respuesta = ?', [idRespuesta])
            const formName = this.db.getFirstSync('select name from forms where id = ?', [answer.ID_PLANTILLA]).name

            let data = {}
            fields.map(field => {
                const tipoCampo = this.db.getFirstSync('select field_type_name from field_table_name where id = ?', [field.ENUM_TIPO_CAMPO]).field_type_name
                data[field.NOMBRE_CAMPO] = [tipoCampo, field.VALOR_CAMPO]
            })

            return {
                'plantilla': formName,
                'fecha': answer.FECHA_RESPUESTA,
                'um plantilla': answer.UM_PLANTILLA,
                'idDispositivo': answer.ID_DISPOSITIVO,
                'data': data
            }

        } catch (error) {
            console.log(error)
        }
    }

    addForm(newForm) {
        try {
            this.db.runSync(
                'INSERT INTO forms (name, last_modification) VALUES (?,?)',
                [newForm["nombre formulario"], newForm["ultima modificacion"]]
            )
            const formID = this.db.getFirstSync('SELECT last_insert_rowid() AS id').id

            newForm.campos.forEach((fieldObject, i) => {
                const { id: typeOfField, table_name: fieldTableName } = this.db.getFirstSync('SELECT id, table_name FROM field_table_name WHERE field_type_name=?', [fieldObject.tipo])

                this.db.runSync(
                    'INSERT INTO fields (fk_id_form, fk_field_table_name, name, ordering, obligatory, output) VALUES (?,?,?,?,?,?)',
                    [formID, typeOfField, fieldObject.nombre, i, fieldObject.obligatorio, fieldObject.salida]
                )
                const lastFieldId = this.db.getFirstSync('SELECT id FROM fields ORDER BY id DESC LIMIT 1').id
                if (!this.chainInsertors.insert(fieldObject, lastFieldId, typeOfField, fieldTableName))
                    throw new Error(`Tipo de campo desconocido ${fieldObject.tipo}`)
            })
        } catch (error) {
            console.log(error)
        }
    }

    deleteForm(formName) {
        try {
            const formID = this.db.getFirstSync('SELECT id FROM forms WHERE name = ?', [formName]).id   
            
            const fieldsID = this.db.getAllSync('SELECT fk_field_table_name FROM fields WHERE fk_id_form = ?', [formID])
            console.log(fieldsID)
            fieldsID.forEach(field => {
                const fieldTableName = this.db.getFirstSync('SELECT table_name FROM field_table_name WHERE id = ?', [field.fk_field_table_name]).table_name
                const fieldTypeName = this.db.getFirstSync('SELECT field_type_name FROM field_table_name WHERE id = ?', [field.fk_field_table_name]).field_type_name
                //if (!this.chainInsertors.delete(field.id, fieldTableName)) throw new Error('Error al eliminar')
                this.chainInsertors.delete(field.fk_field_table_name, fieldTableName, fieldTypeName)
                this.db.runSync('DELETE FROM fields WHERE id = ?', [field.fk_field_table_name])
            })
            this.db.runSync('DELETE FROM forms WHERE id = ?', [formID])
            //this.db.getForms()
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
                    [id, this.db.getComponnentTypeId(field.tipo), field.nombre, i, field.obligatorio, field.salida]
                )
                if (!this.chainInsertors.insert(fieldObject)) throw new Error('Error al insertar')
            })
            this.db.getForms()
        } catch (error) {
            console.log(error)
        }

        try {
            const statement = this.db.prepareSync('UPDATE forms SET name = ?, output_file_name = ?, last_modification = ?  WHERE id = ?')
            statement.executeSync([(form.name, form.output_file_name, form.last_modification, id])
            this.db.getForms()
        } catch (error) {
            console.log(error)
        }
    } */


    insertAnswer(answerObject) {
        const formID = this.db.getFirstSync('SELECT id FROM forms WHERE name = ?', [answerObject.plantilla]).id
        this.db.runSync(
            'INSERT INTO respuestas (id_plantilla, fecha_respuesta, um_plantilla, id_dispositivo) VALUES (?,?,?,?)',
            [formID, answerObject.fecha, answerObject["um plantilla"], answerObject["idDispositivo"]]
        )
        const lastAnswerID = this.db.getFirstSync('SELECT ID_RESPUESTA FROM respuestas ORDER BY ID_RESPUESTA DESC LIMIT 1')['ID_RESPUESTA']

        Object.entries(answerObject.data).forEach(([fieldOutput, [typeOfField, value]]) => {
            this.db.runSync(
                'INSERT INTO campo_respuesta (id_respuesta, enum_tipo_campo, nombre_campo, valor_campo) VALUES (?,?,?,?)',
                [lastAnswerID, this.db.getFirstSync('SELECT id from field_table_name where field_type_name = ?', typeOfField).id, fieldOutput, value.toString()]
            )
        })
    }

    deleteAnswers(formID, answerID) {
        this.db.runSync('DELETE FROM respuestas WHERE id_plantilla = ?', [formID])
        this.db.runSync('DELETE FROM campo_respuesta WHERE id_respuesta = ?', [answerID])
    }

    getComponnentTypeId(fieldType) {
        return this.db.getFirstSync('SELECT id FROM field_table_name WHERE field = ?', [fieldType]).id
    }

    isFormNameRepeated(formName) {
        const result = this.db.getFirstSync('SELECT 1 FROM forms WHERE name = ? LIMIT 1', [formName])
        return result === undefined
    }
}
