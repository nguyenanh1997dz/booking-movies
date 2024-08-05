const express = require("express");
const StatisticalController = require("../controller/statisticalCtrl");

const router = express.Router();

router.get('/movies',StatisticalController.movieRevenue);

module.exports = router; 