export default initDatabaseScript = {
    "dbInit": `
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    last_modification TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS fields (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_id_form INTEGER REFERENCES forms(id) NOT NULL,
    fk_field_table_name INTEGER REFERENCES field_table_name(id) NOT NULL,
    name TEXT NOT NULL,
    ordering INTEGER NOT NULL,
    obligatory INTEGER NOT NULL,
    output TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS field_table_name (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name TEXT UNIQUE,
    field_type_name TEXT NOT NULL UNIQUE
    );
    CREATE UNIQUE INDEX field_name ON field_table_name(table_name);

    CREATE TABLE IF NOT EXISTS text_properties (
    fk_field INTEGER REFERENCES fields(id) NOT NULL,
    id_formats INTEGER PRIMARY KEY AUTOINCREMENT,
    qr_refillable INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS selector_properties (
    fk_field INTEGER REFERENCES fields(id) NOT NULL,
    id_options INTEGER PRIMARY KEY AUTOINCREMENT,
    default_option TEXT,
    selector_placeholder TEXT
    );

    CREATE TABLE IF NOT EXISTS date_properties (
    fk_field INTEGER REFERENCES fields(id) NOT NULL,
    date_format TEXT NOT NULL,
    default_date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS hour_properties (
    fk_field INTEGER REFERENCES fields(id) NOT NULL,
    default_time TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS camera_properties (
    fk_field INTEGER REFERENCES fields(id) NOT NULL,
    aspect_relation TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS limitations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    regex TEXT,
    value_enum_matrix INTEGER NOT NULL
    );
    CREATE INDEX name_limitation ON limitations(name);

    CREATE TABLE IF NOT EXISTS limitations_intermediary (
    fk_field INTEGER REFERENCES fields(id) NOT NULL, 
    fk_limitations INTEGER REFERENCES limitations(id) NOT NULL
    );
    CREATE INDEX fk_forms_int_lim ON limitations_intermediary(fk_field);
    CREATE INDEX fk_field_int_lim ON limitations_intermediary(fk_field);
    CREATE INDEX fk_limitations_int_lim ON limitations_intermediary(fk_limitations);

    CREATE TABLE IF NOT EXISTS format (
    id_text_format INTEGER REFERENCES text_properties(id_formats) NOT NULL,
    name TEXT NOT NULL UNIQUE,
    value_enum_matrix INTEGER NOT NULL
    );
    CREATE UNIQUE INDEX name_format ON format(id_text_format);

    CREATE TABLE IF NOT EXISTS options (
    fk_selector_id INTEGER REFERENCES selector_properties(id_options) NOT NULL,
    name TEXT NOT NULL,
    value TEXT NOT NULL
    );

    CREATE TABLE compatibility_matrix (
    fila INTEGER NOT NULL,
    columna INTEGER NOT NULL,
    fk_field_type_id TEXT REFERENCES field_table_name(id) NOT NULL,
    limitation_or_format INTEGER NOT NULL
    );

    CREATE TABLE RESPUESTAS (
    ID_RESPUESTA INT PRIMARY KEY,
    ID_PLANTILLA INT,
    UM_PLANTILLA INT,
    ID_DISPOSITIVO TEXT,
    FOREIGN KEY (ID_PLANTILLA) REFERENCES FORMS(ID)
);

-- Crear la tabla CAMPO_RESPUESTA
    CREATE TABLE CAMPO_RESPUESTA (
        ID_CAMPO_RESPUESTA INT,
        ID_RESPUESTA INT,
        NOMBRE_CAMPO TEXT,
        VALOR_CAMPO TEXT,
        PRIMARY KEY (ID_CAMPO_RESPUESTA),
        FOREIGN KEY (ID_RESPUESTA) REFERENCES RESPUESTAS(ID_RESPUESTA)
    );

    -- Crear un índice compuesto para las columnas fila y columna
    CREATE INDEX idx_fila_columna ON compatibility_matrix (fila, columna);
    `
}
