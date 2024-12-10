import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite'
import TextChainInsertor from './componentInsertor/TextChainInsertor'
import SelectorChainInsertor from './componentInsertor/SelectorChainInsertor'
import DateChainInsertor from './componentInsertor/DateChainInsertor'
import TimeChainInsertor from './componentInsertor/TimeChainInsertor'
import CameraChainInsertor from './componentInsertor/CameraChainInsertor'

dbInit = require('../database/tables.sql')

export async function initializeDataBase(db) {
    try {
        db.execSync(dbInit)
        console.log('Database inicialized')
    } catch (error) {
        console.log(error)
    }
}

// Singleton factory method to get the instance
let instance = null

export function getDatabaseInstance(db) {
    if (!instance) {
        instance = new DataBase(db)
    }
    return instance
}

export default class DataBase {
    constructor() {
        if (DataBase.instance) {
            return DataBase.instance // Return the existing instance if it already exists
        }
        this.db = useSQLiteContext()
        DataBase.instance = this // Cache the instance
        this.chainInsertors =
            (new TextChainInsertor())
                .add(new SelectorChainInsertor())
                .add(new DateChainInsertor())
                .add(new TimeChainInsertor())
                .add(new CameraChainInsertor())
    }

    getForms() {
        try {
            const allRows = this.db.getAllSync('SELECT * FROM forms')
            console.log(allRows)
        } catch (error) {
            console.log(error)
        }
    }

    addForm(newForm) {
        try {
            const statement = this.db.prepareSync('INSERT INTO forms (name, output_file_name, last_modification) VALUES (?,?,?)')
            const id = statement.executeSync([newForm.nombre, newForm["nombre archivo salida"], newForm["ultima modificacion"]]).getFirstSync().id
            newForm.fields.forEach((fieldObject, i) => {
                this.db.runSync(
                    'INSERT INTO fields (fk_id_form, fk_field_table_name, name, order, obligatory, output) VALUES (?,?,?,?,?,?)',
                    [id, this.getComponnentTypeId(fieldObject.tipo), fieldObject.nombre, i, fieldObject.obligatorio, fieldObject.salida]
                )
                if (!this.chainInsertors.insert(fieldObject)) throw new Error('Error al insertar')
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
            const id = statement.executeSync([form.nombre, newForm["nombre archivo salida"], newForm["ultima modificacion"]]).getFirstSync().id
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

    async getComponnentTypeId(fieldType) {
        return this.db.runSync('SELECT id FROM field_table_name WHERE field = ?', [fieldType])
    }
}
