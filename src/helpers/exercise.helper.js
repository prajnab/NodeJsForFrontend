#!/usr/bin/env node

const { SQL } = require("../database/index.js");

async function createExercise(userId, description, duration, date) {
    const result = await SQL.run(
        `
        INSERT INTO
            Exercise
            (userId, description, duration, date)
        VALUES
            (?, ?, ?, ?)
        `,
        userId,
        description,
        duration,
        date
    );

    if (result?.changes) {
        const exercise = {
            userId: parseInt(userId),
            exerciseId: result.lastID,
            duration: parseInt(duration),
            description,
            date,
        };
        return exercise;
    }
    return false;
}

async function getAllExercises() {
    const exercises = await SQL.all(`SELECT * FROM Exercise`);

    return exercises;
}

async function getExercisesForUserId(userId, limit) {
    const exercises = await SQL.all(
        `
        SELECT
            *,
            COUNT(*) OVER () AS count
        FROM
            Exercise
        WHERE
            userId=(?)
        ${!!limit ? "LIMIT ?" : ""}
        `,
        userId,
        !limit || isNaN(limit) ? 100 : Math.min(parseInt(limit), 100)
    );

    return exercises;
}

async function getExercisesForUserIdBetween(userId, from, to, limit) {
    const exercises = await SQL.all(
        `
        SELECT
            *,
            (SELECT COUNT(*) FROM Exercise WHERE userId = (?) AND date BETWEEN (?) AND (?)) AS count
        FROM
            Exercise
        WHERE
            userId = (?)
        AND
            date BETWEEN (?) AND (?)
        ORDER BY
            date
        LIMIT (?)
        `,
        userId,
        from,
        to,
        userId,
        from,
        to,
        !limit || isNaN(limit) ? 100 : Math.min(parseInt(limit), 100)
    );

    return exercises;
}

module.exports = {
    createExercise,
    getAllExercises,
    getExercisesForUserId,
    getExercisesForUserIdBetween,
};
