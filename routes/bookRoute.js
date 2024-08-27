const express = require("express");
const { authMiddleware ,isAdmin} = require("../middleware/authMiddlewere");
const BookController = require("../controller/bookCtrl");

const router = express.Router();
router.get("/", BookController.getAllBook)
router.get("/:id", BookController.getBookById)
router.post("/", BookController.createBook)
router.post("/cash", BookController.confirmCashPaymentSuccess)
router.post("/vnpay", BookController.confirmVnpayPaymentSuccess)
router.post("/cancel", BookController.confirmCancelBookMovie)
module.exports = router;