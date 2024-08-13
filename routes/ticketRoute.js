const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const BookController = require("../controller/bookCtrl");

const router = express.Router();

router.get("/", BookController.allTicket) 
router.get("/:id", BookController.ticketById) 
router.get("/user/all", authMiddleware,BookController.userTicket)
router.get("/uuid/:uuid",BookController.ticketByUuid) 
router.post("/verify-email", BookController.verifyEmail); // Thêm route mới
router.post("/verify-otp", BookController.verifyOtp); // Thêm route xác minh OTP
module.exports = router; 