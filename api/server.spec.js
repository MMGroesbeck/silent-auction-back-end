const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");


// ================== cleaning database before all tests run ===================== //

beforeAll(async () => {
    await db("users").truncate();
    await db("auctions").truncate();
    await db("bids").truncate();
    await db("watching").truncate();
});

// =============================================================================== //

// ========================== getting token for seller =========================== //
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
// =============================================================================== //



// ======================= testing auction end points ============================ //

describe("GET /api/auctions", () => {
    test("returns a list of auctions", async () => {
      const response = await request(server)
        .get("/api/auctions")
        // add an authorization header with the token
        .set("authorization", token);
      expect(response.statusCode).toBe(200);
    });
});

describe("POST /api/auctions", () => {
    test("/api/auctions post request denied without token", () => {
        return request(server)
            .post("/api/auctions")
            .send({
                name: "name",
                description: "description",
                user_id: "1",
                image_url: "http/link/to/img",
                end_datetime: "2020-10-10 09:17:21",
                start_datetime: "2019-10-10 09:17:21",
                status: "active",
                reserve: 0
            })
            .then((res) => {
                expect(res.status).toBe(400);
            });
    });
});

describe("POST /api/auctions", () => {
    test("/api/auctions post success with token", async () => {
        const response = await request(server)
            .post("/api/auctions")
            .set("authorization", token)
            .send({
                name: "name",
                description: "description",
                user_id: "1",
                image_url: "http/link/to/img",
                end_datetime: "2020-10-10 09:17:21",
                start_datetime: "2019-10-10 09:17:21",
                status: "active",
                reserve: 0
            });
            expect(response.statusCode).toBe(201);
    });
})

describe("GET /api/auctions/:id", () => {
    test("returns an auction if exist", () => {
      return request(server)
        .get("/api/auctions/1")
        .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
        });
    });
});

describe("GET /api/auctions/:id", () => {
    test("returns an empty array if doesn't exist", () => {
      return request(server)
        .get("/api/auctions/5")
        .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0);
        });
    });
});

// =============================================================================== //

// ======================== testing register and login =========================== //

describe("testing users endpoints", () => {
    test("/api/users/register post request should return 201 on success", () => {
        return request(server)
            .post("/api/users/register")
            .send({ password: "mila", username: "mila", email: "mila@gmail.com", role: "bidder" })
            .then((res) => {
                expect(res.status).toBe(201);
            });
        });
    test("/api/users/register should regect registration because of existing email", () => {
        return request(server)
            .post("/api/users/register")
            .send({ password: "joe", username: "joe", email: "mila@gmail.com", role: "bidder" })
            .then((res) => {
                expect(res.status).toBe(400);
            });
        });
    test("/api/users/register should regect registration because of existing username", () => {
        return request(server)
            .post("/api/users/register")
            .send({ password: "mila", username: "mila", email: "joe@gmail.com", role: "bidder" })
            .then((res) => {
                expect(res.status).toBe(500);
            });
        });
    test("/api/users/register should allow registration with same email but different role", () => {
        return request(server)
            .post("/api/users/register")
            .send({ password: "mila", username: "lyudmila", email: "mila@gmail.com", role: "seller" })
            .then((res) => {
                expect(res.status).toBe(201);
            });
        });
    test("/api/users/login can login", () => {
        return request(server)
            .post("/api/users/login")
            .send({ password: "mila", username: "mila"})
            .then((res) => {
                expect(res.status).toBe(200);
            });
    });
    test("/api/users/login can't login if password is incorrect", () => {
        return request(server)
            .post("/api/users/login")
            .send({ password: "mila1", username: "mila"})
            .then((res) => {
                expect(res.status).toBe(401);
            });
    });
    test("/api/users/login can't login if username is incorrect", () => {
        return request(server)
            .post("/api/users/login")
            .send({ password: "mila", username: "mila1"})
            .then((res) => {
                expect(res.status).toBe(401);
            });
    });
});

// =============================================================================== //
