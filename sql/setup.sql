DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT 
);

CREATE TABLE notes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    tags TEXT[],
    favorite BOOLEAN,
    date_modified DATE
);

CREATE TABLE tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tag_text TEXT NOT NULL
);

CREATE TABLE users_tags (
    tag_id INTEGER,
    notetaker_id INTEGER
);