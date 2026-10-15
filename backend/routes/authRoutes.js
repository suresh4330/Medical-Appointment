const express = require("express");

const { register, login, getDoctors } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/doctors", verifyToken, getDoctors);

module.exports = router;