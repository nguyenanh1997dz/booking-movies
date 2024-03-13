const express = require("express");
const VNPAYController = require("../controller/vnpayCtrl");
const router = express.Router();
router.post('/',VNPAYController.createPayment);
router.get('/',VNPAYController.getPaymentInfo);
module.exports = router; 