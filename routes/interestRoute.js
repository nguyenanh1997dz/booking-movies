const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const InterestController = require("../controller/interestCtrl");
const router = express.Router();

router.get("/", InterestController.getAllInterest)

router.get("/:id", InterestController.getInterest)

router.get("/detail/:id", InterestController.getInterestById);

router.post("/", InterestController.createInterest)

router.put("/:id", InterestController.updateInterest)

module.exports = router;