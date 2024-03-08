const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const BookController = require("../controller/bookCtrl");

const router = express.Router();
router.get("/", BookController.getAllBook)
router.post("/", BookController.createBook)

module.exports = router;