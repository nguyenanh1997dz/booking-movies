const express = require("express");
const Food = require("../model/foodModel");
const FoodController = require("../controller/foodCtrl");
const { imgResize, uploadPhoto } = require("../middleware/upLoadImage");

const router = express.Router();
router.get('/', FoodController.getAll)
router.post('/', FoodController.create)
router.post("/img", uploadPhoto.single("image"), imgResize, FoodController.uploadImgFood)
module.exports = router;