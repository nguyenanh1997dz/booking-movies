const express = require("express");
const StatisticalController = require("../controller/statisticalCtrl");

const router = express.Router();

router.get('/chart',StatisticalController.chartStatistical);
router.get('/branches',StatisticalController.branchRevenue);
router.get('/branches/:branchId',StatisticalController.branchMovieRevenueDetail);
module.exports = router; 