const express = require("express");
const {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
} = require("../controllers/favorites");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(protect);

router.route("/").get(getFavorites).post(addFavorite);

router.route("/:countryCode").get(checkFavorite).delete(removeFavorite);

module.exports = router;
