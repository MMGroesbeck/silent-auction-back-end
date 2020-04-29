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
    .send({
      password: "katya",
      username: "katya",
      email: "katya@gmail.com",
      role: "seller",
    })
    .end((err, response) => {
      done();
    });
});

beforeAll((done) => {
  request(server)
    .post("/api/users/login")
    .send({
      username: "katya",
      password: "katya",
    })
    .end((err, response) => {
      token = response.body.token;
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
        reserve: 0,
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
        end_datetime: "2019-10-10 09:17:21",
        start_datetime: "2019-10-10 09:17:21",
        status: "active",
        reserve: 0,
      });
    expect(response.statusCode).toBe(201);
  });
});

describe("POST /api/auctions", () => {
  test("creating another auction for future tests", async () => {
    const response = await request(server)
      .post("/api/auctions")
      .set("authorization", token)
      .send({
        name: "testAuction",
        description: "descriptiondescription",
        user_id: "1",
        image_url: "http/link/to/img",
        end_datetime: "2020-10-10 09:17:21",
        start_datetime: "2019-10-10 09:17:21",
        status: "active",
        reserve: 0,
      });
    expect(response.statusCode).toBe(201);
  });
});

describe("POST /api/auctions", () => {
  test("creating auction with end date in past", async () => {
    const response = await request(server)
      .post("/api/auctions")
      .set("authorization", token)
      .send({
        name: "testAuction",
        description: "descriptiondescription",
        user_id: "1",
        image_url: "http/link/to/img",
        end_datetime: "2019-11-10 09:17:21",
        start_datetime: "2019-10-10 09:17:21",
        status: "active",
        reserve: 0,
      });
    expect(response.body.auct[0].id).toBe(3);
    expect(response.statusCode).toBe(201);
  });
});

describe("GET /api/auctions/:id", () => {
  test("returns an auction if exist", () => {
    return request(server)
      .get("/api/auctions/1")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        // auction should be active
        expect(res.body[0].status).toBe("active");
      });
  });
  test("status updated to 'completed' if end date in past", () => {
    return request(server)
      .get("/api/auctions/3")
      .then((res) => {
        console.log("GET third", res.body);
        expect(res.body[0].status).toBe("completed");
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

describe("GET /api/auctions/seller", () => {
  test("returns array of auctions where logged-in user is seller", async () => {
    const response = await request(server)
      .get("/api/auctions/seller")
      .set("authorization", token);
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /api/auctions/:id/bids", () => {
  test("returns array of bids", async () => {
    const response = await request(server)
      .get("/api/auctions/1/bids")
      .set("authorization", token);
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /api/auctions/:id/bids", () => {
  test("returns 404 if auction doesn't exist", async () => {
    const response = await request(server)
      .get("/api/auctions/5/bids")
      .set("authorization", token);
    expect(response.statusCode).toBe(404);
  });
});

describe("PUT /api/auctions/id", () => {
  test("changing data for auction", async () => {
    const response = await request(server)
      .put("/api/auctions/1")
      .set("authorization", token)
      .send({
        name: "name",
        description: "description",
        user_id: "1",
        image_url: "http/link/to/img",
        end_datetime: "2020-10-12 09:17:21",
        start_datetime: "2019-10-10 09:17:21",
        status: "active",
        reserve: 0,
      });
    expect(response.statusCode).toBe(200);
  });
});

describe("PUT /api/auctions/id", () => {
  test("changing request denied without proper autherization", async () => {
    const response = await request(server).put("/api/auctions/1").send({
      name: "newName",
      description: "description",
      user_id: "1",
      image_url: "http/link/to/img",
      end_datetime: "2020-10-12 09:17:21",
      start_datetime: "2019-10-10 09:17:21",
      status: "active",
      reserve: 0,
    });
    expect(response.statusCode).toBe(400);
  });
});

describe("DELETE /api/auctions/id", () => {
  test("Sets the property 'status' to 'canceled'", async () => {
    const response = await request(server)
      .delete("/api/auctions/1")
      .set("authorization", token);
    expect(response.body.message).toBe("Canceled.");
  });
});

describe("DELETE /api/auctions/id", () => {
  test("Rejects request without authorization", async () => {
    const response = await request(server).delete("/api/auctions/1");
    expect(response.statusCode).toBe(400);
  });
});

// =============================================================================== //

// ========================== getting token for bidder =========================== //

let bidderToken;

beforeAll((done) => {
  request(server)
    .post("/api/users/register")
    .send({
      password: "toos",
      username: "toos",
      email: "toos@gmail.com",
      role: "bidder",
    })
    .end((err, response) => {
      done();
    });
});

beforeAll((done) => {
  request(server)
    .post("/api/users/login")
    .send({
      username: "toos",
      password: "toos",
    })
    .end((err, response) => {
      bidderToken = response.body.token;
      done();
    });
});

// =============================================================================== //

// ================= testing auction end points for bidders ====================== //

describe("POST /api/auctions", () => {
  test("/api/auctions post rejected if user is a bidder", async () => {
    const response = await request(server)
      .post("/api/auctions")
      .set("authorization", bidderToken)
      .send({
        name: "auctionName",
        description: "description",
        user_id: "2",
        image_url: "http/link/to/img",
        end_datetime: "2020-10-10 09:17:21",
        start_datetime: "2019-10-10 09:17:21",
        status: "active",
        reserve: 0,
      });
    expect(response.statusCode).toBe(400);
  });
});

describe("GET /api/auctions/:id/bids", () => {
  test("rejected if user is a bidder", async () => {
    const response = await request(server)
      .get("/api/auctions/1/bids")
      .set("authorization", bidderToken);
    expect(response.statusCode).toBe(400);
  });
});

// =============================================================================== //

// =============================== testing bidders =============================== //

describe("POST /api/bidders/:id/bids", () => {
  test("bidders can't bid on auction with canceled property", async () => {
    const response = await request(server)
      .post("/api/bidders/2/bids")
      .set("authorization", bidderToken)
      .send({
        auction_id: 1,
        bid_amount: 100,
      });
    expect(response.body.message).toBe("Auction is not active.");
  });
});

describe("POST /api/bidders/:id/bids", () => {
  test("bidders can bid on existing auction", async () => {
    const response = await request(server)
      .post("/api/bidders/2/bids")
      .set("authorization", bidderToken)
      .send({
        auction_id: 2,
        bid_amount: 100,
      });
    console.log("BID: ", response.body.message);
    expect(response.statusCode).toBe(200);
  });
});

describe("POST /api/bidders/:id/bids", () => {
  test("bidders can't bid if bidding user does not match logged-in user", async () => {
    const response = await request(server)
      .post("/api/bidders/1/bids")
      .set("authorization", bidderToken)
      .send({
        auction_id: 2,
        bid_amount: 100,
      });
    expect(response.body.message).toBe(
      "Bidding user does not match logged-in user."
    );
  });
});

describe("GET /api/bidders/:id", () => {
  test("returning information about user", async () => {
    const response = await request(server)
      .get("/api/bidders/1")
      .set("authorization", bidderToken);
    expect(response.statusCode).toBe(200);
    expect(response.body[0].username).toBe("katya");
  });
});

describe("GET /api/bidders/:id", () => {
  test("returning more info like email if requested id = logged in user id", async () => {
    const response = await request(server)
      .get("/api/bidders/2")
      .set("authorization", bidderToken);
    expect(response.statusCode).toBe(200);
    expect(response.body[0].email).toBe("toos@gmail.com");
  });
});

describe("GET /api/bidders/:id/bids", () => {
  test("returns list of bids for logged-in bidder", async () => {
    const response = await request(server)
      .get("/api/bidders/2/bids")
      .set("authorization", bidderToken);
    expect(response.body.length).toBe(1);
    /*errorMessage": "select `b`.`id` as `bid_id`, `b`.`user_id` as `user_id`, 
        `b`.`auction_id` as `auction_id`, `b`.`bid_amount`, `b`.`bid_time`, `u`.
        `username`, `a`.`name` from `bids` 
        as `b` inner join `users` as `u` on `u`.`id` = `b`.`user_id` inner join 
        `auctions` as `a` on `a`.`id` = `b`.`auction_id` where `user_id` = '2' order 
        by `b`.`bid_time` asc - SQLITE_ERROR: ambiguous column name: user_id */
    /* Fixed by correcting query for getBids function in bidders-model.js */
  });
});

// =============================================================================== //

// ======================== testing watching functionality ======================= //

describe("POST /api/watching/:id", () => {
  test("adds auction to the watchlist", async () => {
    const response = await request(server)
      .post("/api/watching/2")
      .set("authorization", bidderToken);
    expect(response.statusCode).toBe(201);
  });
});

describe("POST /api/watching/:id", () => {
  test("can't add auction in a watchlist without authorization", async () => {
    const response = await request(server).post("/api/watching/2");
    expect(response.statusCode).toBe(400);
  });
});

describe("GET /api/watching/", () => {
  test("recieving watching data", async () => {
    const response = await request(server)
      .get("/api/watching")
      .set("authorization", bidderToken);
    expect(response.statusCode).toBe(200);
  });
});

describe("DELETE /api/watching/1", () => {
  test("deleting auction from watchlist", async () => {
    const response = await request(server)
      .delete("/api/watching/2")
      .set("authorization", bidderToken);
    expect(response.statusCode).toBe(200);
  });
});

// =============================================================================== //

// ======================== testing register and login =========================== //

describe("testing users endpoints", () => {
  test("/api/users/register post request should return 201 on success", () => {
    return request(server)
      .post("/api/users/register")
      .send({
        password: "mila",
        username: "mila",
        email: "mila@gmail.com",
        role: "bidder",
      })
      .then((res) => {
        expect(res.status).toBe(201);
      });
  });
  test("/api/users/register should regect registration because of existing email", () => {
    return request(server)
      .post("/api/users/register")
      .send({
        password: "joe",
        username: "joe",
        email: "mila@gmail.com",
        role: "bidder",
      })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });
  test("/api/users/register should regect registration because of existing username", () => {
    return request(server)
      .post("/api/users/register")
      .send({
        password: "mila",
        username: "mila",
        email: "joe@gmail.com",
        role: "bidder",
      })
      .then((res) => {
        expect(res.status).toBe(500);
      });
  });
  test("/api/users/register should allow registration with same email but different role", () => {
    return request(server)
      .post("/api/users/register")
      .send({
        password: "mila",
        username: "lyudmila",
        email: "mila@gmail.com",
        role: "seller",
      })
      .then((res) => {
        expect(res.status).toBe(201);
      });
  });
  test("/api/users/login can login", () => {
    return request(server)
      .post("/api/users/login")
      .send({ password: "mila", username: "mila" })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });
  test("/api/users/login can't login if password is incorrect", () => {
    return request(server)
      .post("/api/users/login")
      .send({ password: "mila1", username: "mila" })
      .then((res) => {
        expect(res.status).toBe(401);
      });
  });
  test("/api/users/login can't login if username is incorrect", () => {
    return request(server)
      .post("/api/users/login")
      .send({ password: "mila", username: "mila1" })
      .then((res) => {
        expect(res.status).toBe(401);
      });
  });
});

// =============================================================================== //
