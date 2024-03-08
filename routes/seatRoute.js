const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const SeatController = require("../controller/seatCtrl");

const router = express.Router();
router.get("/", SeatController.getAllSeat)
router.post("/", SeatController.createSeat)

module.exports = router;