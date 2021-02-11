const { serializeHandler, deserializeHandler } = require("../passport-config");

jest.mock("../db");
const db = require("../db");

jest.mock("jsonwebtoken");
const jwt = require("jsonwebtoken");

const done = jest.fn();

db.User.updateOne.mockImplementation(({ username }, { jwt }) => { 
    return new Promise((resolve) => {
       if (username !== "vasilii_shabanov@epam.com") {
           resolve();
       }
       done(null, { username: "vasilii_shabanov@epam.com", password: "qwerty", jwt: "q1w2e3r4t5" });
       resolve({ n: 1, nModified: 1, ok: 1 });
    });
})

jwt.sign.mockImplementation(({username}, secret) => {
    return "q1w2e3r4t5";
}); 

const user = { username: "vasilii_shabanov@epam.com", password: "qwerty" };

describe("serializer test suite", () => {
    test("serializeHandler should call done with updated user object", async () => {
        await serializeHandler(user, done);
        expect(done.mock.calls[0][0]).toBe(null);
        expect(done.mock.calls[0][1]).toStrictEqual({ username: "vasilii_shabanov@epam.com", password: "qwerty", jwt: "q1w2e3r4t5" });
    });

    test("deserializeHandler should call done with user object", async () => {
        await deserializeHandler({ username: "vasilii_shabanov@epam.com", password: "qwerty", jwt: "q1w2e3r4t5" }, done);
        expect(done.mock.calls[1][0]).toBe(null);
        expect(done.mock.calls[1][1]).toStrictEqual({ username: "vasilii_shabanov@epam.com", password: "qwerty", jwt: "q1w2e3r4t5" });
    });
});