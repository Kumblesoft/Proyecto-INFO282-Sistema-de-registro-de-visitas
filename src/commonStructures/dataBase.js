import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite'

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
let instance = null;

export function getDatabaseInstance(db) {
    if (!instance) {
        instance = new DataBase(db);
    }
    return instance;
}

export default class DataBase {
    constructor() {
        if (DataBase.instance) {
            return DataBase.instance; // Return the existing instance if it already exists
        }
        this.db = useSQLiteContext();
        DataBase.instance = this; // Cache the instance
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
            statement.executeSync([newForm.name, newForm.output_file_name, newForm.last_modification])
            newForm.fields.forEach((field) => {
                this.db.runSync(
                    'INSERT INTO fields (fk_id_form, fk_field_table_name, name, order, obligatory, output) VALUES (?,?,?,?,?,?)',
                    [field.fk_id_form, field.fk_field_table_name, field.name, field.order, field.obligatory, field.output]
                )
                tableName = this.getTableName(field.type)
                switch (tableName) {
                    case 'text':
                        this.db.runSync(
                            'INSERT INTO fields (fk_filed, qr_refillable, fk_limitations, fk_format) VALUES (?,?,?,?)',
                            [tableName, field.lable, field.fk_limitations, field.fk_format]
                        )
                        field.limitations.forEach((limitation) => {

                        })
                        break
                    case 'selector':
                        break
                    case 'date':
                        break
                    case 'time':
                        break
                    case 'camera':
                        break
                }
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

    async updateForm(id, form) {
        try {
            const statement = this.db.prepareSync('UPDATE forms SET name = ?, output_file_name = ?, last_modification = ?  WHERE id = ?')
            statement.executeSync([(form.name, form.output_file_name, form.last_modification, id])
            this.getForms()
        } catch (error) {
            console.log(error)
        }
    }

    async getTableName(fieldName) {
        const id = this.db.runSync('SELECT id FROM field_table_name WHERE field = ?', [fieldName])
        if (id.changes > 0) {
            const tableName = this.db.runSync('SELECT getFieldTableName(?)', [id])
            return tableName
        }
    }
}
