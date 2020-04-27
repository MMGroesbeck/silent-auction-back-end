const request = require("supertest");
const server = require("../api/server");
const db = require("../data/dbConfig");

describe("testing users endpoints: login and register", () => {
    afterAll(async () => {
        await db("users").truncate();
    });

    test("should return 201 on success", () => {
        return request(server)
            .post("/api/users/register")
            .send({ password: "mila", username: "mila", email: "mila@gmail.com", role: "bidder" })
            .then((res) => {
                expect(res.status).toBe(201);
            });
        });
    test("should regect registration because of existing email", () => {
        return request(server)
            .post("/api/users/register")
            .send({ password: "joe", username: "joe", email: "mila@gmail.com", role: "bidder" })
            .then((res) => {
                expect(res.status).toBe(400);
            });
        });
    test("should regect registration because of existing username", () => {
        return request(server)
            .post("/api/users/register")
            .send({ password: "mila", username: "mila", email: "joe@gmail.com", role: "bidder" })
            .then((res) => {
                expect(res.status).toBe(500);
            });
        });
    test("should allow registration with same email but different role", () => {
        return request(server)
            .post("/api/users/register")
            .send({ password: "mila", username: "lyudmila", email: "mila@gmail.com", role: "seller" })
            .then((res) => {
                expect(res.status).toBe(201);
            });
        });
    test("can login", () => {
        return request(server)
            .post("/api/users/login")
            .send({ password: "mila", username: "mila"})
            .then((res) => {
                expect(res.status).toBe(200);
            });
    });
    test("can't login if password is incorrect", () => {
        return request(server)
            .post("/api/users/login")
            .send({ password: "mila1", username: "mila"})
            .then((res) => {
                expect(res.status).toBe(401);
            });
    });
    test("can't login if username is incorrect", () => {
        return request(server)
            .post("/api/users/login")
            .send({ password: "mila", username: "mila1"})
            .then((res) => {
                expect(res.status).toBe(401);
            });
    });
});
