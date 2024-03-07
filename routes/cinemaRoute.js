const express = require("express");
const CinemaController = require("../controller/cinemaCtrl");
const router = express.Router();

router.post('/',CinemaController.createCinema)
router.get('/',CinemaController.getAllCinema)
module.exports = router;