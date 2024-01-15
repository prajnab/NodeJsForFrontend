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

async function getExercisesForUserId(userId) {
    const exercises = await SQL.all(
        `
        SELECT
            *
        FROM
            Exercise
        WHERE
            userId=(?)
        `,
        userId
    );

    return exercises;
}

async function getExercisesForUserIdBetween(userId, from, to) {
    const exercises = await SQL.all(
        `
        SELECT
            *
        FROM
            Exercise
        WHERE
            (userId = ?)
        AND
            date BETWEEN (?) and (?)
        `,
        userId,
        from,
        to
    );

    return exercises;
}

module.exports = {
    createExercise,
    getAllExercises,
    getExercisesForUserId,
    getExercisesForUserIdBetween,
};
