const express = require("express");
const UserController = require("../controller/userCtrl");
const { authMiddleware, isAdmin} = require("../middleware/authMiddlewere");
const router = express.Router();

router.post("/register",UserController.createUser);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.post("/refreshToken", UserController.refreshToken);

router.get("/get-all-users",authMiddleware,isAdmin,UserController.getAllUser)

router.get("/get-user-by-id/:id",UserController.getUserById)

router.delete("/delete-user/:id",UserController.deleteUser)

router.put("/update-user/:id",UserController.updateUser)

router.put("/block-user/:id",authMiddleware,isAdmin,UserController.blockUser)

router.put("/unblock-user/:id",UserController.unBlockUser)

router.put("/change-password",authMiddleware,UserController.changePassword)

router.get("/forgot-password/:email",UserController.forgotPassword)

router.post("/reset-password",UserController.reset_Password)

module.exports = router;