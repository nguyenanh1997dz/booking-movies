const express = require("express");
const UserController = require("../controller/userCtrl");
const { authMiddleware, isAdmin} = require("../middleware/authMiddlewere");
const { uploadPhoto,imgResize } = require("../middleware/upLoadImage");
const router = express.Router();

router.post("/register",UserController.createUser);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.post("/refreshToken", UserController.refreshToken);

router.get("/get-all-users",authMiddleware,isAdmin,UserController.getAllUser)

router.get("/get-user-by-id/:id",UserController.getUserById)

router.delete("/delete-user/:id",UserController.deleteUser)

router.put("/block-user/:id",UserController.blockUser)

router.put("/unblock-user/:id",UserController.unBlockUser)

router.post("/user-img-upload",uploadPhoto.single("avatar"),imgResize,UserController.upLoadImage)
module.exports = router;