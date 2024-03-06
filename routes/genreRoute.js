const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const GenreController = require("../controller/genreCtrl");

const router = express.Router();
router.get("/all-genre",GenreController.getAllGenre)
router.get("/:id",GenreController.getGenreById)
router.post("/add-genre",GenreController.createGenre)

module.exports = router;