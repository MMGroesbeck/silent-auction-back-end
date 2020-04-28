const request = require("supertest");
const server = require("../api/server");
const db = require("../data/dbConfig");

describe("testing users endpoints", () => {
    afterAll(async () => {
        await db("users").truncate();
    });
// getting token
    let token;

    beforeAll((done) => {
        request(server)
            .post("/api/users/register")
            .send({ password: "katya", username: "katya", email: "katya@gmail.com", role: "seller" })
            .end((err, response) => {
                done();
            });
    });

    beforeAll((done) => {
      request(server)
        .post('/api/users/login')
        .send({
          username: "katya",
          password: "katya",
        })
        .end((err, response) => {
          token = response.body.token; // save the token!
          console.log("token when created", token);
          done();
        });
    });
//api/auctions
    test("request denied without token", () => {
        return request(server)
            .post("/api/auctions")
            .send({
                name: "name",
                description: "description",
                user_id: "1",
                image_url: "http/link/to/img",
                end_datetime: "2020-10-10 09:17:21"
            })
            .then((res) => {
                expect(res.status).toBe(400);
            });
    });

    describe("request success with a  token", () => {
        console.log("token inside request", token)
        return request(server)
            .post("/api/auctions")
            .set('Authorization', token )
            .send({
                name: "name",
                description: "description",
                user_id: 1,
                image_url: "http/link/to/img",
                end_datetime: "2020-10-10 09:17:21"
            })
            .then((res) => {
                expect(res.status).toBe(201);
            });
    });
// //register and login
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
