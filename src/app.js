#!/usr/bin/env node
const { initializeSQL } = require("./database/index.js");
const { ErrorHandler } = require("./middlewares/errorHandler.js");
const { UserRoute } = require("./routes/user.routes.js");
const express = require("express");

const app = express();
const cors = require("cors");
require("dotenv").config();

async function initializeApp() {
    app.use(cors());
    app.use(express.static("public"));

    await initializeSQL();

    app.get("/", (req, res) => {
        res.sendFile(__dirname + "/public/index.html");
    });

    app.use("/api/users", UserRoute);

    app.use(ErrorHandler);

    const listener = app.listen(process.env.PORT || 3000, () => {
        console.log("Your app is listening on port " + process.env.PORT);
    });
}

module.exports = { initializeApp };
