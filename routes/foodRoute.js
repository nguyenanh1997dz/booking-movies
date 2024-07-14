const express = require("express");
const Food = require("../model/foodModel");
const FoodController = require("../controller/foodCtrl");

const router = express.Router();
router.get('/', FoodController.getAll)
router.post('/', FoodController.create)
module.exports = router;