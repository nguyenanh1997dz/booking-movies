const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const MovieController = require("../controller/movieCtrl");
const router = express.Router();
const { uploadPhoto, imgResize } = require("../middleware/upLoadImage");

router.get("/", MovieController.getAllMovie)
router.get("/:id", MovieController.getMovieById)
router.post("/", MovieController.createMovie)
router.put("/:id", MovieController.updateMovie)
router.delete("/:id", MovieController.deleteMovie)
router.post("/img", uploadPhoto.single("image"), imgResize, MovieController.uploadImgMovie)
router.get("/top/top-movies", MovieController.getTopMovies)
router.delete("/img/:id", MovieController.deleteImageMovie)
router.post("/add-review", authMiddleware, MovieController.reviewMovies)
router.get("/get-review/:movieId", MovieController.getMovieReviewDetail)
router.put("/comment/like", authMiddleware, MovieController.likeComment)
module.exports = router;