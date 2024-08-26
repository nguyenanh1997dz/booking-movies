const express = require("express");
const { authMiddleware,isAdmin } = require("../middleware/authMiddlewere");
const InterestController = require("../controller/interestCtrl");
const router = express.Router();

router.get("/", InterestController.getAllInterest)
router.get("/movie", InterestController.getInterestByMovie) // params =  ?idMovie
router.get("/detail/:id", InterestController.getInterest)
router.get("/branch", InterestController.getAllBranchInterest); // params = branchId , movieId
router.get("/movie/:id", InterestController.getMovieInterest);
router.post("/",authMiddleware,isAdmin, InterestController.createInterest)
router.put("/updateStatus", InterestController.updateStatusInterest)
router.put("/:id",authMiddleware,isAdmin, InterestController.updateInterest)

module.exports = router;