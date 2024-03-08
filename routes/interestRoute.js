const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const InterestController = require("../controller/interestCtrl");
const router = express.Router();

router.get("/", InterestController.getInterest)
router.post("/", InterestController.createInterest)
router.put("/:id", InterestController.updateInterest)

module.exports = router;