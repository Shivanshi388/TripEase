const express = require("express");
const { register, login } = require("../controllers/authController");
const { registerValidator, loginValidator } = require("../validators/authValidator");
const validateMiddleware = require("../middleware/validateMiddleware");
const { authRateLimit } = require("../middleware/rateLimitMiddleware");

const router = express.Router();
router.post("/register", authRateLimit, registerValidator, validateMiddleware, register);
router.post("/login", authRateLimit, loginValidator, validateMiddleware, login);
module.exports = router;
