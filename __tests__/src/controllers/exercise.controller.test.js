const {
    createExercise,
    getLogs,
} = require("../../../src/controllers/exercise.controller");
const exerciseHelper = require("../../../src/helpers/exercise.helper");
const userHelper = require("../../../src/helpers/user.helper");

jest.mock("../../../src/helpers/exercise.helper");
jest.mock("../../../src/helpers/user.helper");

const mockRequest = () => {
    return {
        body: {},
        params: {},
        query: {},
    };
};

const mockResponse = () => {
    const res = {};
    res.writeHead = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = jest.fn();

describe("createExercise", () => {
    it("should create exercise and return 201 if user exists and valid data with date is provided", async () => {
        const req = mockRequest();
        req.body = {
            description: "Running",
            duration: 30,
            date: "2022-01-15",
        };
        req.params._id = "1";
        const res = mockResponse();

        userHelper.getUserFromId.mockResolvedValue({
            id: 1,
            username: "testUser",
        });
        exerciseHelper.createExercise.mockResolvedValue({
            exerciseId: "exerciseId",
            description: "Running",
            duration: 30,
            date: "2022-01-15",
        });

        await createExercise(req, res, mockNext);

        expect(res.writeHead).toHaveBeenCalledWith(201, expect.any(Object));
        expect(res.end).toHaveBeenCalledWith(
            JSON.stringify({
                status: "ok",
                data: {
                    exerciseId: "exerciseId",
                    description: "Running",
                    duration: 30,
                    date: "2022-01-15",
                },
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should create exercise and return 201 if user exists and valid data without date is provided", async () => {
        const req = mockRequest();
        req.body = {
            description: "Running",
            duration: 30,
        };
        req.params._id = "1";
        const res = mockResponse();

        userHelper.getUserFromId.mockResolvedValue({
            id: 1,
            username: "testUser",
        });
        exerciseHelper.createExercise.mockResolvedValue({
            exerciseId: "exerciseId",
            description: "Running",
            duration: 30,
            date: "2022-01-15",
        });

        await createExercise(req, res, mockNext);

        expect(res.writeHead).toHaveBeenCalledWith(201, expect.any(Object));
        expect(res.end).toHaveBeenCalledWith(
            JSON.stringify({
                status: "ok",
                data: {
                    exerciseId: "exerciseId",
                    description: "Running",
                    duration: 30,
                    date: "2022-01-15",
                },
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if description is missing", async () => {
        const req = mockRequest();
        req.body = {
            duration: 30,
            date: "2022-01-15",
        };
        req.params._id = "1";
        const res = mockResponse();

        await createExercise(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Missing required data(description)",
        });
    });

    it("should return 400 if duration is missing", async () => {
        const req = mockRequest();
        req.body = {
            description: "Running",
            date: "2022-01-15",
        };
        req.params._id = "1";
        const res = mockResponse();

        await createExercise(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Missing required data(duration)",
        });
    });

    it("should return 400 if duration is not a number", async () => {
        const req = mockRequest();
        req.body = {
            duration: "one",
            description: "Running",
            date: "2022-01-15",
        };
        req.params._id = "1";
        const res = mockResponse();

        await createExercise(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Exercise duration must be a positive number(mins)",
        });
    });

    it("should return 400 if duration is a negative number", async () => {
        const req = mockRequest();
        req.body = {
            duration: -10,
            description: "Running",
            date: "2022-01-15",
        };
        req.params._id = "1";
        const res = mockResponse();

        await createExercise(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Exercise duration must be a positive number(mins)",
        });
    });

    it("should return 400 if duration is a decimal number", async () => {
        const req = mockRequest();
        req.body = {
            duration: 2.5,
            description: "Running",
            date: "2022-01-15",
        };
        req.params._id = "1";
        const res = mockResponse();

        await createExercise(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Exercise duration must be a positive number(mins)",
        });
    });

    it("should return 400 if duration is a 0", async () => {
        const req = mockRequest();
        req.body = {
            duration: 0,
            description: "Running",
            date: "2022-01-15",
        };
        req.params._id = "1";
        const res = mockResponse();

        await createExercise(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Exercise duration cannot be 0",
        });
    });

    it("should return 400 if date is invalid", async () => {
        const req = mockRequest();
        req.body = {
            description: "Running",
            duration: 30,
            date: "invalidDate",
        };
        req.params._id = "1";
        const res = mockResponse();

        userHelper.getUserFromId.mockResolvedValue({
            id: 1,
            username: "testUser",
        });

        await createExercise(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Invalid Date",
        });
    });

    it("should return GenericError if exercise creation fails", async () => {
        const req = mockRequest();
        req.body = {
            description: "Running",
            duration: 30,
            date: "2022-01-15",
        };
        req.params._id = "1";
        const res = mockResponse();

        userHelper.getUserFromId.mockResolvedValue({
            id: 1,
            username: "testUser",
        });
        exerciseHelper.createExercise.mockResolvedValue(null);

        await createExercise(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Something went wrong",
        });
    });

    it("should return UserDoesNotExistError if user does not exist", async () => {
        const req = mockRequest();
        req.body = {
            description: "Running",
            duration: 30,
            date: "2022-01-15",
        };
        req.params._id = "nonexistentUserId";
        const res = mockResponse();

        userHelper.getUserFromId.mockResolvedValue(null);

        await createExercise(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 404,
            message: "User does not Exist",
        });
    });
});

describe("getLogs", () => {
    it("should get exercise logs for a user without date range and limit", async () => {
        const req = mockRequest();
        req.params._id = "1";
        const res = mockResponse();

        userHelper.getUserFromId.mockResolvedValue({
            id: 1,
            username: "testUser",
        });
        exerciseHelper.getExercisesForUserId.mockResolvedValue([
            {
                exerciseId: "exerciseId1",
                description: "Running",
                duration: 30,
                date: "2022-01-15",
                count: 2,
            },
            {
                exerciseId: "exerciseId2",
                description: "Cycling",
                duration: 45,
                date: "2022-01-16",
                count: 2,
            },
        ]);

        await getLogs(req, res, mockNext);

        expect(res.writeHead).toHaveBeenCalledWith(200, expect.any(Object));
        expect(res.end).toHaveBeenCalledWith(
            JSON.stringify({
                status: "ok",
                data: {
                    id: 1,
                    username: "testUser",
                    logs: [
                        {
                            id: "exerciseId1",
                            description: "Running",
                            duration: 30,
                            date: "2022-01-15",
                        },
                        {
                            id: "exerciseId2",
                            description: "Cycling",
                            duration: 45,
                            date: "2022-01-16",
                        },
                    ],
                    count: 2,
                },
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should get exercise logs for a user with date range and limit", async () => {
        const req = mockRequest();
        req.params._id = "1";
        req.query.from = "2022-01-15";
        req.query.to = "2022-01-16";
        req.query.limit = "1";
        const res = mockResponse();

        userHelper.getUserFromId.mockResolvedValue({
            id: 1,
            username: "testUser",
        });
        exerciseHelper.getExercisesForUserIdBetween.mockResolvedValue([
            {
                exerciseId: "exerciseId1",
                description: "Running",
                duration: 30,
                date: "2022-01-15",
                count: 1,
            },
        ]);

        await getLogs(req, res, mockNext);

        expect(res.writeHead).toHaveBeenCalledWith(200, expect.any(Object));
        expect(res.end).toHaveBeenCalledWith(
            JSON.stringify({
                status: "ok",
                data: {
                    id: 1,
                    username: "testUser",
                    logs: [
                        {
                            id: "exerciseId1",
                            description: "Running",
                            duration: 30,
                            date: "2022-01-15",
                        },
                    ],
                    count: 1,
                },
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should get exercise logs for a user with date range and no limit", async () => {
        const req = mockRequest();
        req.params._id = "1";
        req.query.from = "2022-01-15";
        req.query.to = "2022-01-16";
        const res = mockResponse();

        userHelper.getUserFromId.mockResolvedValue({
            id: 1,
            username: "testUser",
        });
        exerciseHelper.getExercisesForUserIdBetween.mockResolvedValue([
            {
                exerciseId: "exerciseId1",
                description: "Running",
                duration: 30,
                date: "2022-01-15",
                count: 1,
            },
        ]);

        await getLogs(req, res, mockNext);

        expect(res.writeHead).toHaveBeenCalledWith(200, expect.any(Object));
        expect(res.end).toHaveBeenCalledWith(
            JSON.stringify({
                status: "ok",
                data: {
                    id: 1,
                    username: "testUser",
                    logs: [
                        {
                            id: "exerciseId1",
                            description: "Running",
                            duration: 30,
                            date: "2022-01-15",
                        },
                    ],
                    count: 1,
                },
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should get empty exercise logs for a user when he has no exercises saved", async () => {
        const req = mockRequest();
        req.params._id = "1";
        req.query.from = "2022-01-15";
        req.query.to = "2022-01-16";
        const res = mockResponse();

        userHelper.getUserFromId.mockResolvedValue({
            id: 1,
            username: "testUser",
        });
        exerciseHelper.getExercisesForUserIdBetween.mockResolvedValue([]);

        await getLogs(req, res, mockNext);

        expect(res.writeHead).toHaveBeenCalledWith(200, expect.any(Object));
        expect(res.end).toHaveBeenCalledWith(
            JSON.stringify({
                status: "ok",
                data: {
                    id: 1,
                    username: "testUser",
                    logs: [],
                    count: 0,
                },
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 if "from" is missing', async () => {
        const req = mockRequest();
        req.params._id = "1";
        req.query.to = "2022-01-16";
        req.query.limit = "1";
        const res = mockResponse();

        await getLogs(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Missing query(from)",
        });
    });

    it('should return 400 if "to" is missing', async () => {
        const req = mockRequest();
        req.params._id = "1";
        req.query.from = "2022-01-15";
        req.query.limit = "1";
        const res = mockResponse();

        await getLogs(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Missing query(to)",
        });
    });

    it("should return UserDoesNotExistError if user does not exist", async () => {
        const req = mockRequest();
        req.body = {
            description: "Running",
            duration: 30,
            date: "2022-01-15",
        };
        req.params._id = "1";
        const res = mockResponse();

        userHelper.getUserFromId.mockResolvedValue(null);

        await getLogs(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 404,
            message: "User does not Exist",
        });
    });
});
