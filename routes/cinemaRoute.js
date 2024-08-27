const express = require("express");
const CinemaController = require("../controller/cinemaCtrl");
const { authMiddleware, isAdmin} = require("../middleware/authMiddlewere");
const router = express.Router();

router.post('/',authMiddleware,isAdmin,CinemaController.createCinema)

router.get('/',CinemaController.getAllCinema)

router.put('/:id',authMiddleware,isAdmin,CinemaController.updateCinema)
module.exports = router;