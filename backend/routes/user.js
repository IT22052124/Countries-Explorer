const express = require("express");
const { updateProfile, changePassword } = require("../controllers/user");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(protect);

router.put("/profile", updateProfile);
router.put("/password", changePassword);

module.exports = router;
