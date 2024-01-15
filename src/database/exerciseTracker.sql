PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY ASC,
    username VARCHAR(40)
);

CREATE TABLE IF NOT EXISTS Exercise (
    exerciseId INTEGER PRIMARY KEY ASC,
    userId INTEGER,
    duration INTEGER,
    description VARCHAR(100),
    date DATE,

    FOREIGN KEY (userId) REFERENCES User(id)
);
