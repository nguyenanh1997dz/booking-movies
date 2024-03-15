const express = require("express");
const CinemaController = require("../controller/cinemaCtrl");
const router = express.Router();

router.post('/',CinemaController.createCinema)

router.get('/',CinemaController.getAllCinema)

router.put('/:id',CinemaController.updateCinema)
module.exports = router;