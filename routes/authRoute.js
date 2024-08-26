const express = require("express");
const UserController = require("../controller/userCtrl");
const { authMiddleware, isAdmin} = require("../middleware/authMiddlewere");
const { imgResize, uploadPhoto } = require("../middleware/upLoadImage");
const router = express.Router();

router.post("/register",UserController.createUser);
router.post("/login", UserController.login);
router.post("/google-login", UserController.googleLogin);
router.get("/current-user",authMiddleware,UserController.getCurentUser)
router.get("/get-user-by-id/:id",authMiddleware,isAdmin,UserController.getUserById)
router.get("/get-all-users",authMiddleware,isAdmin,UserController.getAllUser)
router.delete("/delete-user/:id",authMiddleware,isAdmin,UserController.deleteUser)
router.put("/update-user/:id",authMiddleware,UserController.updateUser)
router.put("/change-password",authMiddleware,UserController.changePassword)
router.get("/forgot-password/:email",UserController.forgotPassword)
router.post("/reset-password",UserController.reset_Password)
router.post("/img", uploadPhoto.single("avatar"), imgResize, UserController.uploadAvatar)
module.exports = router;