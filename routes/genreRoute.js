const express = require("express");
const GenreController = require("../controller/genreCtrl");
const { authMiddleware, isAdmin} = require("../middleware/authMiddlewere");
const router = express.Router();
router.get("/", GenreController.getAllGenre)
router.get("/:id", GenreController.getGenreById)
router.post("/",authMiddleware,isAdmin, GenreController.createGenre)
router.delete("/:id",authMiddleware,isAdmin, GenreController.deleteGenre)
router.put("/:id",authMiddleware,isAdmin, GenreController.updateGenre)
module.exports = router;