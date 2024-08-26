const express = require("express");
const StatisticalController = require("../controller/statisticalCtrl");
const { authMiddleware, isAdmin} = require("../middleware/authMiddlewere");
const router = express.Router();

router.get('/chart',authMiddleware,isAdmin,StatisticalController.chartStatistical);
router.get('/movie-sales-summary',authMiddleware,isAdmin,StatisticalController.movieSalesSummary);
router.get('/branches/:branchId',authMiddleware,isAdmin,StatisticalController.branchMovieRevenueDetail);
module.exports = router; 