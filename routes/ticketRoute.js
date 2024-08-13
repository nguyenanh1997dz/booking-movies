const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const BookController = require("../controller/bookCtrl");

const router = express.Router();

router.get("/", BookController.allTicket) // tất cả vé , trả về mảng 
router.get("/:id", BookController.ticketById) // chi tiết vé theo id của vé , trả về object
router.get("/user/all", authMiddleware,BookController.userTicket) // tất cả vé theo user ( yêu cầu đăng nhập), trả về mảng 
router.get("/uuid/:uuid",BookController.ticketByUuid) // tra cứu theo uuid của vé ( trang tra cứu), trả về object
module.exports = router; 