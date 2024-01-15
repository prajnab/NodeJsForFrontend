#!/usr/bin/env node

const userHelper = require("../helpers/user.helper.js");

const SuccessHeaders = {
    "Content-Type": "application/json",
    "Cache-Control": "max-age: 0, no-cache",
};
const UserDoesNotExistError = {
    statusCode: 404,
    message: "User does not Exist",
};
const GenericError = { statusCode: 400, message: "Something went wrong" };

exports.getUserFromNameOrId = async (req, res, next) => {
    const { username, id } = req.query ?? {};

    if (username) {
        const user = await userHelper.getUserFromUsername(username);
        if (user) {
            const data = { status: "ok", data: user };

            res.writeHead(200, SuccessHeaders);
            res.end(JSON.stringify(data));
        } else {
            next(UserDoesNotExistError);
        }
    } else if (id) {
        const user = await userHelper.getUserFromId(id);
        if (user) {
            const data = { status: "ok", data: user };

            res.writeHead(200, SuccessHeaders);
            res.end(JSON.stringify(data));
        } else {
            next(UserDoesNotExistError);
        }
    } else {
        const result = await userHelper.getAllUsers();
        const data = { status: "ok", data: result };

        res.writeHead(200, SuccessHeaders);
        res.end(JSON.stringify(data));
    }
};

exports.createUser = async (req, res, next) => {
    const { username } = req.body ?? {};
    if (username?.trim()) {
        const existingUser = await userHelper.getUserFromUsername(username);
        if (existingUser) {
            next({ statusCode: 400, message: "User Already Exists" });
        } else {
            const newUser = await userHelper.createUser(username);
            if (newUser) {
                const data = { status: "ok", data: newUser };

                res.writeHead(201, SuccessHeaders);
                res.end(JSON.stringify(data));
            } else {
                next(GenericError);
            }
        }
    } else {
        next({ statusCode: 400, message: "Username missing" });
    }
};

exports.getUserFromId = async (req, res, next) => {
    const id = req.params._id;

    const user = await userHelper.getUserFromId(id);
    if (user) {
        const data = { status: "ok", data: user };

        res.writeHead(200, SuccessHeaders);
        res.end(JSON.stringify(data));
    } else {
        next(UserDoesNotExistError);
    }
};
