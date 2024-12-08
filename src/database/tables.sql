PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    output_file_name TEXT NOT NULL,
    last_modification TEXT NOT NULL,
);

CREATE TABLE IF NOT EXISTS fields (
    fk_id_form INTEGER REFERENCES forms(id),
    fk_field_table_name INTEGER REFERENCES field_table_name(id),
    name TEXT NOT NULL,
    order INTEGER NOT NULL,
    obligatory INTEGER NOT NULL,
    output TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS field_table_name (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field TEXT NOT NULL
);

CREATE UNIQUE INDEX field_name ON field_table_name(field);

CREATE FUNCTION getFiedlTableName(field_table_name_id INTEGER) RETURNS TEXT AS 
BEGIN
    DECLARE table_name INTEGER;
    SELECT field INTO table_name FROM field_table_name WHERE field_table_type_id = id;
    RETURN table_name;
END;

CREATE TABLE IF NOT EXISTS text (
    fk_field TEXT REFERENCES field_table_name(field),
    qr_refillable INTEGER NOT NULL,
    fk_limitations INTEGER REFERENCES limitations(id),
    fk_format INTEGER REFERENCES format(id)
);

CREATE TABLE IF NOT EXISTS selector (
    fk_field TEXT REFERENCES field_table_name(field),
    dafault_option TEXT,
    dafault_text TEXT NOT NULL,
    fk_options INTEGER REFERENCES options(id),
);

CREATE TABLE IF NOT EXISTS date (
    fk_field TEXT REFERENCES field_table_name(field),
    dafault_text TEXT NOT NULL,
    dafault_date TEXT NOT NULL,
    format TEXT NOT NULL,
    fk_limitations INTEGER REFERENCES limitations(id)
);

CREATE TABLE IF NOT EXISTS time (
    fk_field TEXT REFERENCES field_table_name(field),
    dafault_time TEXT NOT NULL,
    fk_limitations INTEGER REFERENCES limitations(id)
);

CREATE TABLE IF NOT EXISTS camera (
    fk_field TEXT REFERENCES field_table_name(field),
    editable INTEGER NOT NULL,
    aspect_relation TEXT NOT NULL
); 

CREATE TABLE IF NOT EXISTS limitations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value TEXT NOT NULL,
    regex TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS format (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    value TEXT NOT NULL
);
