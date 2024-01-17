#!/usr/bin/env node

const exerciseHelper = require("../helpers/exercise.helper.js");
const userHelper = require("../helpers/user.helper.js");

const moment = require("moment");
const DATE_FORMAT = "YYYY-MM-DD";

const SuccessHeaders = {
    "Content-Type": "application/json",
    "Cache-Control": "max-age: 0, no-cache",
};
const UserDoesNotExistError = {
    statusCode: 404,
    message: "User does not Exist",
};
const GenericError = { statusCode: 400, message: "Something went wrong" };

exports.createExercise = async (req, res, next) => {
    const { description, duration, date } = req.body ?? {};
    const id = req.params._id;

    const user = await userHelper.getUserFromId(id);
    if (user) {
        if (!description) {
            next({
                statusCode: 400,
                message: "Missing required data(description)",
            });
        } else if (!duration) {
            next({
                statusCode: 400,
                message:
                    duration === 0
                        ? "Exercise duration cannot be 0"
                        : "Missing required data(duration)",
            });
        } else if (isNaN(duration) || duration < 1 || duration % 1 !== 0) {
            next({
                statusCode: 400,
                message: "Exercise duration must be a positive number(mins)",
            });
        } else {
            if (date) {
                const isValidDate = moment(date, DATE_FORMAT).isValid();
                if (!isValidDate) {
                    next({
                        statusCode: 400,
                        message: "Invalid Date",
                    });
                    return;
                }
            }
            const formattedDate = moment(date ? date : undefined).format(
                DATE_FORMAT
            );
            const newExercise = await exerciseHelper.createExercise(
                id,
                description,
                duration,
                formattedDate
            );
            if (newExercise) {
                const data = { status: "ok", data: newExercise };

                res.writeHead(201, SuccessHeaders);
                res.end(JSON.stringify(data));
            } else {
                next(GenericError);
            }
        }
    } else {
        next(UserDoesNotExistError);
    }
};

exports.getLogs = async (req, res, next) => {
    const { _id: id } = req.params ?? {};
    const { limit, from, to } = req.query ?? {};

    const user = await userHelper.getUserFromId(id);
    if (user) {
        let exercises = [];
        if (!from && !to) {
            exercises = await exerciseHelper.getExercisesForUserId(id, limit);
        } else if (!from) {
            next({ statusCode: 400, message: "Missing query(from)" });
            return;
        } else if (!to) {
            next({ statusCode: 400, message: "Missing query(to)" });
            return;
        } else {
            exercises = await exerciseHelper.getExercisesForUserIdBetween(
                id,
                from,
                to,
                limit
            );
        }

        const count = exercises?.length ? exercises[0].count : 0;
        const logs = exercises.reduce((prevVal, currVal) => {
            prevVal.push({
                id: currVal.exerciseId,
                description: currVal.description,
                duration: currVal.duration,
                date: currVal.date,
            });
            return prevVal;
        }, []);

        const data = {
            status: "ok",
            data: { ...user, logs, count },
        };
        res.writeHead(200, SuccessHeaders);
        res.end(JSON.stringify(data));
    } else {
        next(UserDoesNotExistError);
    }
};
