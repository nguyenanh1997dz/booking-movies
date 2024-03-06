const express = require("express");
const UserController = require("../controller/userCtrl");
const { authMiddleware } = require("../middleware/authMiddlewere");
const router = express.Router();

router.post("/register",UserController.createUser);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.post("/refreshToken", UserController.refreshToken);

router.get("/get-all-users",UserController.getAllUser)

router.get("/get-user-by-id/:id",UserController.getUserById)

router.delete("/delete-user/:id",UserController.deleteUser)

module.exports = router;