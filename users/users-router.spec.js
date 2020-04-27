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
});
