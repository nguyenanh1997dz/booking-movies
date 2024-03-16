const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const MovieController = require("../controller/movieCtrl");
const router = express.Router();

router.get("/", MovieController.getAllMovie)
router.get("/:id", MovieController.getMovieById)
router.post("/", MovieController.createMovie)
router.delete("/", MovieController.deleteMovie)

module.exports = router;