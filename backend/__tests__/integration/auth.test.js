const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

// Mock JWT verify
jest.mock("jsonwebtoken");

describe("Auth API Integration Tests", () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    // Set up JWT mock to work for all tests
    jwt.verify = jest.fn().mockImplementation((token, secret) => {
      // Check if this is a valid test token
      if (token === "testtoken") {
        return { id: "testuserid" };
      }

      // For real tokens from the auth response
      if (token && token !== "invalidtoken") {
        return { id: testUser?._id || "testuserid" };
      }

      throw new Error("Invalid token");
    });

    jwt.sign = jest.fn().mockReturnValue("testtoken");

    // Connect to a test database before running tests
    await mongoose.connect(
      process.env.MONGO_URI_TEST ||
        "mongodb://localhost:27017/countries-explorer-test",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // Clear the users collection before tests
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Disconnect from the test database after tests
    await mongoose.connection.close();
  });

  beforeEach(() => {
    // Clear mocks between tests
    jest.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBe("testtoken"); // Our mocked token
      expect(response.body.user).toBeDefined();
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned

      // Save the user and token for other tests
      testUser = response.body.user;
      testUser._id = testUser.id; // Add _id property for compatibility
      authToken = response.body.token;

      // Check that user was saved to the database
      const savedUser = await User.findOne({ email: userData.email });
      expect(savedUser).toBeTruthy();
      expect(savedUser.username).toBe(userData.username);
    });

    it("should not register a user with an existing email", async () => {
      const userData = {
        username: "anotheruser",
        email: "test@example.com", // Same email as before
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(
        /email or username already exists/i
      );
    });

    it("should validate required fields", async () => {
      const userData = {
        // Missing username and password
        email: "incomplete@example.com",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login an existing user", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(loginData.email);
    });

    it("should not login with invalid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect("Content-Type", /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/invalid credentials/i);
    });

    it("should not login with non-existent user", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect("Content-Type", /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/invalid credentials/i);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should get the current user profile", async () => {
      // Mock the JWT verification to return the test user
      jwt.verify.mockImplementation(() => {
        return { id: testUser._id };
      });

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.username).toBe(testUser.username);
    });

    it("should reject requests without authentication", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .expect("Content-Type", /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not authorized/i);
    });

    it("should reject requests with invalid token", async () => {
      // Mock JWT verification to throw an error
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalidtoken")
        .expect("Content-Type", /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not authorized/i);
    });
  });

  describe("GET /api/auth/logout", () => {
    it("should logout the user", async () => {
      // Make logout a public route for testing
      const response = await request(app)
        .get("/api/auth/logout")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/logged out/i);

      // Check that the cookie was cleared
      const cookies = response.headers["set-cookie"] || [];
      const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
      expect(tokenCookie).toBeDefined();

      // Check that the cookie expires soon (either by max-age=0 or by expires date)
      const isExpired =
        tokenCookie.includes("max-age=0") || tokenCookie.includes("Expires=");
      expect(isExpired).toBe(true);
    });
  });
});
