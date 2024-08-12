const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const BookController = require("../controller/bookCtrl");

const router = express.Router();

router.get("/", BookController.allTicket) // tất cả vé
router.get("/:id", BookController.ticketById) // chi tiết vé theo id của vé
router.get("/user-tickets",authMiddleware, BookController.ticketById) // tất cả vé theo user ( yêu cầu đăng nhập)

module.exports = router;