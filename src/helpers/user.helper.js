#!/usr/bin/env node

const { SQL } = require("../database/index.js");

async function createUser(username) {
    const result = await SQL.run(
        `
        INSERT INTO
            User
            (username)
        VALUES
            (?)
        `,
        username
    );

    if (result?.changes) {
        const user = getUserFromId(result.lastID);
        return user;
    }
    return false;
}

async function getAllUsers() {
    const users = await SQL.all(`SELECT * FROM User`);

    return users;
}

async function getUserFromId(id) {
    const users = await SQL.all(
        `
        SELECT
            *
        FROM
            User
        WHERE
            id=(?)
        `,
        id
    );

    return users?.length ? users[0] : undefined;
}

async function getUserFromUsername(username) {
    const users = await SQL.all(
        `
        SELECT
            *
        FROM
            User
        WHERE
            LOWER(username) = LOWER(?)
        `,
        username.toLowerCase()
    );

    return users?.length ? users[0] : undefined;
}

module.exports = {
    createUser,
    getAllUsers,
    getUserFromId,
    getUserFromUsername,
};
