const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const InterestController = require("../controller/interestCtrl");
const router = express.Router();

router.get("/", InterestController.getInterestn)
router.get("/:id", InterestController.getInterestp)
router.post("/", InterestController.createInterest)
router.put("/:id", InterestController.updateInterest)

module.exports = router;