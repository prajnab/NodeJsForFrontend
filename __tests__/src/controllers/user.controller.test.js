const {
    getUserFromNameOrId,
    createUser,
    getUserFromId,
} = require("../../../src/controllers/user.controller");
const userHelper = require("../../../src/helpers/user.helper");

jest.mock("../../../src/helpers/user.helper", () => ({
    getUserFromUsername: jest.fn(),
    getUserFromId: jest.fn(),
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
}));

const mockRequest = () => {
    return {
        query: {},
        body: {},
        params: {},
    };
};

const mockResponse = () => {
    const res = {};
    res.writeHead = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = jest.fn();

describe("getUserFromNameOrId", () => {
    it("should get user by username and return 200 if user exists", async () => {
        const req = mockRequest();
        req.query.username = "testUser";
        const res = mockResponse();

        userHelper.getUserFromUsername.mockResolvedValue({
            id: 1,
            username: "testUser",
        });

        await getUserFromNameOrId(req, res, mockNext);

        expect(res.writeHead).toHaveBeenCalledWith(200, expect.any(Object));
        expect(res.end).toHaveBeenCalledWith(
            JSON.stringify({
                status: "ok",
                data: { id: 1, username: "testUser" },
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should get user by user id and return 200 if user exists", async () => {
        const req = mockRequest();
        req.query.id = 1;
        const res = mockResponse();

        userHelper.getUserFromId.mockResolvedValue({
            id: 1,
            username: "testUser",
        });

        await getUserFromNameOrId(req, res, mockNext);

        expect(res.writeHead).toHaveBeenCalledWith(200, expect.any(Object));
        expect(res.end).toHaveBeenCalledWith(
            JSON.stringify({
                status: "ok",
                data: { id: 1, username: "testUser" },
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 404 if user does not exist by username", async () => {
        const req = mockRequest();
        req.query.username = "nonexistentUser";
        const res = mockResponse();

        userHelper.getUserFromUsername.mockResolvedValue(null);

        await getUserFromNameOrId(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 404,
            message: "User does not Exist",
        });
    });

    it("should return 404 if user does not exist by user id", async () => {
        const req = mockRequest();
        req.query.id = 2;
        const res = mockResponse();

        userHelper.getUserFromId.mockResolvedValue(null);

        await getUserFromNameOrId(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 404,
            message: "User does not Exist",
        });
    });

    it("should get all users if username and id is not passed", async () => {
        const req = mockRequest();
        const res = mockResponse();
        const users = [
            {
                id: 1,
                username: "testUser1",
            },
            {
                id: 1,
                username: "testUser2",
            },
        ];

        userHelper.getAllUsers.mockResolvedValue(users);

        await getUserFromNameOrId(req, res, mockNext);

        expect(res.writeHead).toHaveBeenCalledWith(200, expect.any(Object));
        expect(res.end).toHaveBeenCalledWith(
            JSON.stringify({
                status: "ok",
                data: users,
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });
});

describe("getUserFromId", () => {
    it("should get user by user id and return 200 if user exists", async () => {
        const req = mockRequest();
        req.params._id = 1;
        const res = mockResponse();

        userHelper.getUserFromId.mockResolvedValue({
            id: 1,
            username: "testUser",
        });

        await getUserFromId(req, res, mockNext);

        expect(res.writeHead).toHaveBeenCalledWith(200, expect.any(Object));
        expect(res.end).toHaveBeenCalledWith(
            JSON.stringify({
                status: "ok",
                data: { id: 1, username: "testUser" },
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 404 if user does not exist by username", async () => {
        const req = mockRequest();
        req.params._id = 2;
        const res = mockResponse();

        userHelper.getUserFromId.mockResolvedValue(null);

        await getUserFromId(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 404,
            message: "User does not Exist",
        });
    });
});

describe("createUser", () => {
    it("should create user and return 201 if username is provided", async () => {
        const req = mockRequest();
        req.body.username = "newUser";
        const res = mockResponse();

        userHelper.getUserFromUsername.mockResolvedValue(null);
        userHelper.createUser.mockResolvedValue({ id: 1, username: "newUser" });

        await createUser(req, res, mockNext);

        expect(res.writeHead).toHaveBeenCalledWith(201, expect.any(Object));
        expect(res.end).toHaveBeenCalledWith(
            JSON.stringify({
                status: "ok",
                data: { id: 1, username: "newUser" },
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 error if error occurred while creating user", async () => {
        const req = mockRequest();
        req.body.username = "newUser";
        const res = mockResponse();

        userHelper.getUserFromUsername.mockResolvedValue(null);
        userHelper.createUser.mockResolvedValue(false);

        await createUser(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Something went wrong",
        });
    });

    it("should return 400 if username already exists", async () => {
        const req = mockRequest();
        req.body.username = "existingUser";
        const res = mockResponse();

        userHelper.getUserFromUsername.mockResolvedValue({
            id: 1,
            username: "existingUser",
        });

        await createUser(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 400,
            message: "User Already Exists",
        });
    });

    it("should return 400 if username is missing", async () => {
        const req = mockRequest();
        const res = mockResponse();

        await createUser(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Username missing",
        });
    });

    it("should return 400 if username is space", async () => {
        const req = mockRequest();
        req.body.username = " ";
        const res = mockResponse();

        await createUser(req, res, mockNext);

        expect(res.writeHead).not.toHaveBeenCalled();
        expect(res.end).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Username missing",
        });
    });
});
