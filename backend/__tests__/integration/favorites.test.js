const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const User = require("../../models/User");
const Favorite = require("../../models/Favorite");
const jwt = require("jsonwebtoken");

// Mock JWT verify
jest.mock("jsonwebtoken");

describe("Favorites API Integration Tests", () => {
  let testUser;
  let authToken;
  let testFavorite;

  beforeAll(async () => {
    // Connect to test database
    console.log("Connecting to test database:", process.env.MONGO_URI_TEST);
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear databases before tests
    await User.deleteMany({});
    await Favorite.deleteMany({});

    // Create a test user
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    // Register a test user
    console.log("Registering test user...");
    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    console.log("Registration response:", response.status, response.body);

    testUser = response.body.user;
    testUser._id = testUser.id; // Add _id property for compatibility
    authToken = response.body.token;

    console.log("Auth token:", authToken);

    // Setup JWT verification mock to return the test user
    jwt.verify.mockImplementation(() => {
      return { id: testUser._id };
    });

    console.log("Test setup complete. User:", testUser?._id);
  });

  afterAll(async () => {
    // Disconnect from test database
    await mongoose.connection.close();
  });

  beforeEach(() => {
    // Clear mocks between tests
    jest.clearAllMocks();
  });

  describe("POST /api/favorites", () => {
    it("should add a country to favorites", async () => {
      const favoriteData = {
        countryCode: "US",
        countryName: "United States",
        flagUrl: "https://example.com/us-flag.png",
      };

      console.log(
        "Making POST request to /api/favorites with token:",
        authToken
      );
      const response = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .send(favoriteData);

      console.log("Favorites API response:", response.status, response.body);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.countryCode).toBe(favoriteData.countryCode);
      expect(response.body.data.countryName).toBe(favoriteData.countryName);
      expect(response.body.data.userId).toBeDefined();

      // Save for later tests
      testFavorite = response.body.data;

      // Verify it was saved to the database
      const savedFavorite = await Favorite.findOne({
        userId: testUser._id,
        countryCode: favoriteData.countryCode,
      });

      expect(savedFavorite).toBeTruthy();
      expect(savedFavorite.countryName).toBe(favoriteData.countryName);
    });

    it("should not add the same country twice", async () => {
      const favoriteData = {
        countryCode: "US", // Same as before
        countryName: "United States",
        flagUrl: "https://example.com/us-flag.png",
      };

      const response = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .send(favoriteData)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/already in favorites/i);
    });

    it("should require authentication", async () => {
      const favoriteData = {
        countryCode: "CA",
        countryName: "Canada",
        flagUrl: "https://example.com/ca-flag.png",
      };

      const response = await request(app)
        .post("/api/favorites")
        .send(favoriteData) // No auth header
        .expect("Content-Type", /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not authorized/i);
    });
  });

  describe("GET /api/favorites", () => {
    it("should get all user favorites", async () => {
      const response = await request(app)
        .get("/api/favorites")
        .set("Authorization", `Bearer ${authToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].countryCode).toBe(testFavorite.countryCode);
    });

    it("should require authentication", async () => {
      const response = await request(app)
        .get("/api/favorites")
        .expect("Content-Type", /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not authorized/i);
    });
  });

  describe("DELETE /api/favorites/:countryCode", () => {
    it("should remove a country from favorites", async () => {
      const response = await request(app)
        .delete(`/api/favorites/${testFavorite.countryCode}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/removed from favorites/i);

      // Verify it was removed from the database
      const deletedFavorite = await Favorite.findOne({
        userId: testUser._id,
        countryCode: testFavorite.countryCode,
      });

      expect(deletedFavorite).toBeNull();
    });

    it("should return 404 for non-existent favorite", async () => {
      const response = await request(app)
        .delete("/api/favorites/NONEXISTENT")
        .set("Authorization", `Bearer ${authToken}`)
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not found/i);
    });

    it("should require authentication", async () => {
      const response = await request(app)
        .delete("/api/favorites/US")
        .expect("Content-Type", /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not authorized/i);
    });
  });
});
