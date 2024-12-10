PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    name TEXT NOT NULL UNIQUE,
    output_file_name TEXT NOT NULL UNIQUE,
    last_modification TEXT NOT NULL
);
CREATE UNIQUE INDEX form_name ON forms(name);

CREATE TABLE IF NOT EXISTS fields (
    fk_id_form INTEGER REFERENCES forms(id),
    fk_field_table_name INTEGER REFERENCES field_table_name(id),
    name TEXT NOT NULL,
    ordering INTEGER NOT NULL,
    obligatory INTEGER NOT NULL,
    output TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS field_table_name (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    field TEXT NOT NULL UNIQUE
);
CREATE UNIQUE INDEX field_name ON field_table_name(field);

CREATE TABLE IF NOT EXISTS texto (
    fk_forms INTEGER REFERENCES forms(id),
    fk_field INTEGER REFERENCES field_table_name(id),
    qr_refillable INTEGER NOT NULL,
    fk_limitations INTEGER REFERENCES limitations(id),
    fk_format INTEGER REFERENCES format(id)
);

CREATE TABLE IF NOT EXISTS selector (
    fk_field TEXT REFERENCES field_table_name(field),
    dafault_option TEXT,
    dafault_text TEXT NOT NULL,
    fk_options INTEGER REFERENCES options(id)
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

CREATE TABLE IF NOT EXISTS limitations_intermediary (
    id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS limitations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    regex TEXT NOT NULL UNIQUE
);
CREATE UNIQUE INDEX name_limitation ON limitations(name);

CREATE TABLE IF NOT EXISTS format (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    regex TEXT NOT NULL UNIQUE
);
CREATE UNIQUE INDEX name_format ON format(name);

CREATE TABLE IF NOT EXISTS options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    value TEXT NOT NULL
);
