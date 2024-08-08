const express = require("express");
const UserController = require("../controller/userCtrl");
const { authMiddleware, isAdmin} = require("../middleware/authMiddlewere");
const { imgResize, uploadPhoto } = require("../middleware/upLoadImage");
const router = express.Router();

router.post("/register",UserController.createUser);
router.post("/login", UserController.login);
<<<<<<< HEAD

router.post("/google-login", UserController.googleLogin);


=======
router.post("/logout", UserController.logout);
router.post("/refreshToken", UserController.refreshToken);
>>>>>>> 4684d3ddb313352d4bd67142f4654269cd6335e4
router.get("/current-user",authMiddleware,UserController.getCurentUser)
router.get("/get-user-by-id/:id",authMiddleware,isAdmin,UserController.getUserById)
router.get("/get-all-users",authMiddleware,isAdmin,UserController.getAllUser)
router.delete("/delete-user/:id",authMiddleware,isAdmin,UserController.deleteUser)
router.put("/update-user/:id",UserController.updateUser)
router.put("/change-password",authMiddleware,UserController.changePassword)
router.get("/forgot-password/:email",UserController.forgotPassword)
router.post("/reset-password",UserController.reset_Password)
router.post("/img", uploadPhoto.single("avatar"), imgResize, UserController.uploadAvatar)
module.exports = router;