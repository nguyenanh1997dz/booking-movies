const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const GenreController = require("../controller/genreCtrl");

const router = express.Router();
router.get("/", GenreController.getAllGenre)
router.get("/:id", GenreController.getGenreById)
router.post("/", GenreController.createGenre)
router.delete("/:id", GenreController.deleteGenre)
router.put("/:id", GenreController.updateGenre)
module.exports = router;