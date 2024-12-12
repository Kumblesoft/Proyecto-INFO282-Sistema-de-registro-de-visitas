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

   	CREATE TABLE IF NOT EXISTS checkbox_properties (
   	fk_field integer references fields(id) not null,
   	id_options integer primary key autoincrement,
   	default_option TEXT,
   	max_checked_options integer
   	);
   
   	create table if not exists radio_properties (
   	fk_field integer references fields(id) not null,
   	default_option TEXT,
   	id_options integer primary key autoincrement
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
    fk_field int references fields(id),
    fk_limitation int references limitations(id)
    );

   CREATE TABLE IF NOT EXISTS is_formatted (
   fk_id_format int references format(id_format),
   fk_id_text int references text_properties(id_formats)
   );
   
    CREATE TABLE IF NOT EXISTS format (
    id_format INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    value_enum_matrix INTEGER NOT NULL
    );
    

    CREATE TABLE IF NOT EXISTS selector_options (
    fk_selector_id INTEGER REFERENCES selector_properties(id_options) NOT NULL,
    name TEXT NOT NULL,
    value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS radio_options (
    fk_radio_id INTEGER REFERENCES radio_properties(id_options) NOT NULL,
    name TEXT NOT NULL,
    value TEXT NOT NULL
    );
   
    CREATE TABLE IF NOT EXISTS checkbox_options (
    fk_checkbox_id INTEGER REFERENCES checkbox_properties(id_options) NOT NULL,
    name TEXT NOT NULL,
    value TEXT NOT NULL
    );
   
    CREATE TABLE compatibility_matrix (
    fila INTEGER NOT NULL,
    columna INTEGER NOT NULL,
    fk_field_type_id TEXT REFERENCES field_table_name(id) NOT NULL,
    limitation_or_format INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS respuestas (
    ID_RESPUESTA INTEGER PRIMARY KEY AUTOINCREMENT,
    ID_PLANTILLA INT REFERENCES forms(id),
    FECHA_RESPUESTA INT,
    UM_PLANTILLA INT,
    ID_DISPOSITIVO TEXT
	);

    CREATE TABLE IF NOT EXISTS campo_respuesta (
        ID_RESPUESTA INT REFERENCES respuestas(id_respuesta),
        NOMBRE_CAMPO TEXT,
        VALOR_CAMPO TEXT,
    );

    CREATE INDEX idx_fila_columna ON compatibility_matrix (fila, columna);
    `
}
