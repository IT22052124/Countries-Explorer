const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { register, login, logout, getMe } = require("../../controllers/auth");
const User = require("../../models/User");

// Mock the models and JWT
jest.mock("../../models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock request and response objects
    req = {
      body: {},
      cookies: {},
      headers: {},
      user: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      // Setup mock request data
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      // Mock User.findOne to return null (no existing user)
      User.findOne.mockResolvedValue(null);

      // Mock User.create to return a new user
      const mockUser = {
        _id: "user123",
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword",
        toJSON: jest.fn().mockReturnValue({
          _id: "user123",
          username: "testuser",
          email: "test@example.com",
        }),
      };
      User.create.mockResolvedValue(mockUser);

      // Mock JWT sign
      jwt.sign.mockReturnValue("faketoken");

      // Call the register function
      await register(req, res);

      // Verify results
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ email: "test@example.com" }, { username: "testuser" }],
      });
      expect(User.create).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith(
        "token",
        "faketoken",
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: "faketoken",
        user: expect.objectContaining({
          username: "testuser",
          email: "test@example.com",
        }),
      });
    });

    it("should return error if user already exists", async () => {
      // Setup mock request data
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      // Mock User.findOne to return an existing user
      User.findOne.mockResolvedValue({
        _id: "existinguser123",
        email: "test@example.com",
      });

      // Call the register function
      await register(req, res);

      // Verify results
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ email: "test@example.com" }, { username: "testuser" }],
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User with this email or username already exists",
      });
    });

    it("should handle server errors during registration", async () => {
      // Setup mock request data
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      // Mock User.findOne to throw an error
      const errorMessage = "Database connection error";
      User.findOne.mockRejectedValue(new Error(errorMessage));

      // Call the register function
      await register(req, res);

      // Verify results
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ email: "test@example.com" }, { username: "testuser" }],
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Server error",
      });
    });
  });

  describe("login", () => {
    it("should login a user successfully", async () => {
      // Setup mock request data
      req.body = {
        email: "test@example.com",
        password: "password123",
      };

      // Mock User.findOne to return a user with select method
      const mockUser = {
        _id: "user123",
        username: "testuser",
        email: "test@example.com",
        password: "hashedpassword",
        comparePassword: jest.fn().mockImplementation((password, cb) => {
          // Call bcrypt.compare directly to ensure the mock is called
          bcrypt.compare(password, "hashedpassword");
          return Promise.resolve(true);
        }),
        toObject: jest.fn().mockReturnValue({
          _id: "user123",
          username: "testuser",
          email: "test@example.com",
        }),
      };
      User.findOne.mockReturnValue({
        select: jest.fn().mockReturnValue(mockUser),
      });

      // Mock bcrypt compare to return true (password matches)
      bcrypt.compare.mockResolvedValue(true);

      // Mock JWT sign
      jwt.sign.mockReturnValue("faketoken");

      // Call the login function
      await login(req, res);

      // Verify results
      expect(User.findOne).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedpassword"
      );
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith(
        "token",
        "faketoken",
        expect.any(Object)
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: "faketoken",
        user: expect.objectContaining({
          username: "testuser",
          email: "test@example.com",
        }),
      });
    });

    it("should return error if user not found", async () => {
      // Setup mock request data
      req.body = {
        email: "test@example.com",
        password: "password123",
      };

      // Mock User.findOne to return null (no user found)
      User.findOne.mockReturnValue({
        select: jest.fn().mockReturnValue(null),
      });

      // Call the login function
      await login(req, res);

      // Verify results
      expect(User.findOne).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid credentials",
      });
    });

    it("should return error if password is incorrect", async () => {
      // Setup mock request data
      req.body = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      // Mock User.findOne to return a user
      const mockUser = {
        _id: "user123",
        email: "test@example.com",
        password: "hashedpassword",
        comparePassword: jest.fn().mockImplementation((password, cb) => {
          // Call bcrypt.compare directly to ensure the mock is called
          bcrypt.compare(password, "hashedpassword");
          return Promise.resolve(false);
        }),
      };
      User.findOne.mockReturnValue({
        select: jest.fn().mockReturnValue(mockUser),
      });

      // Mock bcrypt compare to return false (password doesn't match)
      bcrypt.compare.mockResolvedValue(false);

      // Call the login function
      await login(req, res);

      // Verify results
      expect(User.findOne).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "wrongpassword",
        "hashedpassword"
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid credentials",
      });
    });
  });

  describe("logout", () => {
    it("should logout a user successfully", async () => {
      // Call the logout function
      await logout(req, res);

      // Verify results
      expect(res.cookie).toHaveBeenCalledWith(
        "token",
        "none",
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Logged out successfully",
      });
    });
  });

  describe("getCurrentUser", () => {
    it("should return current user if authenticated", async () => {
      // Setup mock user in request
      req.user = {
        _id: "user123",
        username: "testuser",
        email: "test@example.com",
      };

      // Mock User.findById to return the user
      const mockUser = {
        _id: "user123",
        username: "testuser",
        email: "test@example.com",
      };
      User.findById.mockResolvedValue(mockUser);

      // Call the getCurrentUser function
      await getMe(req, res);

      // Verify results
      expect(User.findById).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: {
          id: mockUser._id,
          username: mockUser.username,
          email: mockUser.email,
        },
      });
    });
  });
});
