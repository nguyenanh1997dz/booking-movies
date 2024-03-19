const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const MovieController = require("../controller/movieCtrl");
const router = express.Router();
const { uploadPhoto, imgResize } = require("../middleware/upLoadImage");

router.get("/", MovieController.getAllMovie)
router.get("/:id", MovieController.getMovieById)
router.post("/",  MovieController.createMovie)
router.put("/:id", uploadPhoto.single("image"), imgResize, MovieController.updateMovie)
router.delete("/:id", MovieController.deleteMovie)
router.post("/img",uploadPhoto.single("image"), imgResize,  MovieController.uploadImgMovie)
router.delete("/img/:id",MovieController.deleteImageMovie)
module.exports = router;