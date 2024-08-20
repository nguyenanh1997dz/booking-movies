const express = require("express");
const StatisticalController = require("../controller/statisticalCtrl");

const router = express.Router();

router.get('/chart',StatisticalController.chartStatistical);
router.get('/movie-sales-summary',StatisticalController.movieSalesSummary);
router.get('/branches/:branchId',StatisticalController.branchMovieRevenueDetail);
module.exports = router; 