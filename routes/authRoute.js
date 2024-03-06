const express = require("express");
const UserController = require("../controller/userCtrl");
const { authMiddleware } = require("../middleware/authMiddlewere");
const router = express.Router();

router.post("/register",UserController.createUser);
router.post("/login", UserController.login);
router.post("/refreshToken", UserController.refreshToken);
router.get("/",authMiddleware, UserController.refreshToken);
module.exports = router;