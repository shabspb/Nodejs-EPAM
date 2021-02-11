const { authenticateUser, validateJWT } = require("../strategies");

jest.mock("../db");
const db = require("../db");

db.User.find.mockImplementation((searchObject) => {
    return new Promise((resolve) => {
        if (searchObject.username === "vasilii_shabanov@epam.com" || searchObject.jwt === "q1w2e3r4t5") {
            resolve([{ username: "vasilii_shabanov@epam.com", password: "qwerty", jwt: "q1w2e3r4t5" }]);
        }
        resolve([]);
    });
})

const done = jest.fn();
const user = "vasilii_shabanov@epam.com";
const password = "qwerty";
const jwt = "q1w2e3r4t5";

describe("Strategies test suite", () => {
    test("authenticateUser should call done with 'User not found' if incorrect username is provided", async () => {
        await authenticateUser("invalid", "invalid", done);
        expect(done.mock.calls[0][0]).toBe("User not found")
    });

    test("authenticateUser should call done with 'Invalid password' if correct username is provided, but password is invalid", async () => {
        await authenticateUser(user, "invalid", done);
        expect(done.mock.calls[1][0]).toBe("Invalid password");
    });

    test("authenticateUser should call done with user object if correct username and password are provided", async () => {
        await authenticateUser(user, password, done);
        expect(done.mock.calls[2][0]).toBe(null);
        expect(done.mock.calls[2][1]).toStrictEqual({ username: "vasilii_shabanov@epam.com", password: "qwerty", jwt: "q1w2e3r4t5" });
    });

    test("validateJWT should call done with 'Invalid JWT' if JWT is not found in the db", async () => {
        await validateJWT("invalid", done);
        expect(done.mock.calls[3][0]).toBe("Invalid JWT");
    });

    test("validateJWT should call done with user object if JWT is found in the db", async () => {
        await validateJWT(jwt, done);
        expect(done.mock.calls[4][0]).toBe(null);
        expect(done.mock.calls[4][1]).toStrictEqual({ username: "vasilii_shabanov@epam.com", password: "qwerty", jwt: "q1w2e3r4t5" });
    });
})
