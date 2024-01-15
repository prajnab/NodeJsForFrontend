#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");
const util = require("util");

const DB_PATH = path.join(__dirname, "exerciseTracker.db");
const DB_SQL_PATH = path.join(__dirname, "exerciseTracker.sql");

const db = new sqlite3.Database(DB_PATH);
const SQL = {
    run(...args) {
        return new Promise(function c(resolve, reject) {
            db.run(...args, function onResult(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
            });
        });
    },
    all: util.promisify(db.all.bind(db)),
    exec: util.promisify(db.exec.bind(db)),
    get: util.promisify(db.get.bind(db)),
};

async function initializeSQL() {
    const initSQL = fs.readFileSync(DB_SQL_PATH, "utf-8");
    await SQL.exec(initSQL);
}

module.exports = {
    initializeSQL,
    SQL,
};
