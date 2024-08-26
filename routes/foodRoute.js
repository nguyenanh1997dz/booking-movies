const express = require("express");
const Food = require("../model/foodModel");
const FoodController = require("../controller/foodCtrl");
const { imgResize, uploadPhoto } = require("../middleware/upLoadImage");
const { authMiddleware, isAdmin} = require("../middleware/authMiddlewere");
const router = express.Router();
router.get('/', FoodController.getAll)
router.post('/', FoodController.create)
router.delete('/:id',authMiddleware,isAdmin, FoodController.deleteFood)
router.put('/:id',authMiddleware,isAdmin, FoodController.updateFood)
router.post("/img", uploadPhoto.single("image"), imgResize, FoodController.uploadImgFood)
module.exports = router;