const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const MovieController = require("../controller/movieCtrl");
const router = express.Router();
const { uploadPhoto, imgResize } = require("../middleware/upLoadImage");

router.get("/", MovieController.getAllMovie)
router.get("/:id", MovieController.getMovieById)
router.post("/", uploadPhoto.single("image"), imgResize, MovieController.createMovie)
router.put("/:id", uploadPhoto.single("image"), imgResize, MovieController.updateMovie)
router.delete("/:id", MovieController.deleteMovie)

module.exports = router;