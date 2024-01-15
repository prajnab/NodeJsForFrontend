const { Router } = require("express");
const userController = require("../controllers/user.controller.js");
const exerciseController = require("../controllers/exercise.controller.js");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const UserRoute = Router();

UserRoute.get("/", userController.getUserFromNameOrId);

UserRoute.post("/", jsonParser, userController.createUser);

UserRoute.get("/:_id", jsonParser, userController.getUserFromId);

UserRoute.post(
    "/:_id/exercises",
    jsonParser,
    exerciseController.createExercise
);

UserRoute.get("/:_id/logs", jsonParser, exerciseController.getLogs);

module.exports = {
    UserRoute,
};
