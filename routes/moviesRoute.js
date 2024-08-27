const express = require("express");
const { authMiddleware ,isAdmin} = require("../middleware/authMiddlewere");
const MovieController = require("../controller/movieCtrl");
const router = express.Router();
const { uploadPhoto, imgResize } = require("../middleware/upLoadImage");

router.get("/", MovieController.getAllMovie)
router.get("/:id", MovieController.getMovieById)
router.post("/", authMiddleware,isAdmin,MovieController.createMovie)
router.put("/:id",authMiddleware,isAdmin, MovieController.updateMovie)
router.delete("/:id", authMiddleware,isAdmin,MovieController.deleteMovie)
router.post("/img", uploadPhoto.single("image"), imgResize, MovieController.uploadImgMovie)
router.get("/top/top-movies", MovieController.getTopMovies)
router.delete("/img/:id",authMiddleware,isAdmin, MovieController.deleteImageMovie)

router.get("/get-review/:movieId", MovieController.getMovieReviewDetail)

router.post("/add-review", authMiddleware, MovieController.reviewMovies) // body:{ movieId, star, comment }

router.put("/comment/reaction", authMiddleware, MovieController.updateCommentReaction) // body:{ commentId, movieId, action }

module.exports = router;