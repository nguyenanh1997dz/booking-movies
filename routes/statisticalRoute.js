const express = require("express");
const StatisticalController = require("../controller/statisticalCtrl");

const router = express.Router();

router.get('/chart',StatisticalController.chartStatistical);
router.get('/ticket-sold',StatisticalController.ticketSold);
router.get('/seat-sold',StatisticalController.seatSold);
router.get('/branches/:branchId',StatisticalController.branchMovieRevenueDetail);
module.exports = router; 