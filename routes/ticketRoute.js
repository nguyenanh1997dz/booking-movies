const express = require("express");

const BookController = require("../controller/bookCtrl");
const { authMiddleware, isAdmin} = require("../middleware/authMiddlewere");
const router = express.Router();

router.get("/", BookController.allTicket) 
router.get("/:id", BookController.ticketById) 
router.get("/user/all", authMiddleware,BookController.userTicket)
router.get("/uuid/:uuid",BookController.ticketByUuid) 
router.post("/verify-email", BookController.verifyEmail); 
router.post("/verify-otp", BookController.verifyOtp);
router.post("/qr", BookController.testQr);
module.exports = router; 


