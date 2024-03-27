const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const BookController = require("../controller/bookCtrl");

const router = express.Router();
router.get("/", BookController.getAllBook)
router.get("/:id", BookController.getBookById)
router.post("/", BookController.createBook)

module.exports = router;