const Favorite = require("../models/Favorite");
const User = require("../models/User");

// @desc    Add a country to favorites
// @route   POST /api/favorites
// @access  Private
exports.addFavorite = async (req, res) => {
  try {
    const { countryCode, countryName, flagUrl } = req.body;

    if (!countryCode || !countryName) {
      return res.status(400).json({
        success: false,
        message: "Country code and name are required",
      });
    }

    // Check if already in favorites
    const existing = await Favorite.findOne({
      userId: req.user._id,
      countryCode,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Country already in favorites",
      });
    }

    // Create new favorite
    const favorite = await Favorite.create({
      userId: req.user._id,
      countryCode,
      countryName,
      flagUrl,
    });

    res.status(201).json({
      success: true,
      data: favorite,
    });
  } catch (error) {
    console.error("Add favorite error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Remove a country from favorites
// @route   DELETE /api/favorites/:countryCode
// @access  Private
exports.removeFavorite = async (req, res) => {
  try {
    const { countryCode } = req.params;

    // Find and remove from favorites
    const favorite = await Favorite.findOneAndDelete({
      userId: req.user._id,
      countryCode,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Country removed from favorites",
    });
  } catch (error) {
    console.error("Remove favorite error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get all favorites for the logged-in user
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites,
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Check if a country is in favorites
// @route   GET /api/favorites/:countryCode
// @access  Private
exports.checkFavorite = async (req, res) => {
  try {
    const { countryCode } = req.params;

    const favorite = await Favorite.findOne({
      userId: req.user._id,
      countryCode,
    });

    res.status(200).json({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (error) {
    console.error("Check favorite error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
