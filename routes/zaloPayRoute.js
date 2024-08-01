const express = require("express");
const ZaloPayController = require("../controller/zalopayCtrl");

const router = express.Router();
router.post('/',ZaloPayController.createPayment);
router.post('/callback',ZaloPayController.callback);

module.exports = router; 