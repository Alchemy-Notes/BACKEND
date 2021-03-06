DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS users_tags;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT 
);

CREATE TABLE notes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
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
    tag_id BIGINT,
    notetaker_id BIGINT
);
