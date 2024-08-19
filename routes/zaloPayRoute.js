const express = require("express");
const ZaloPayController = require("../controller/zalopayCtrl");

const router = express.Router();
router.post('/',ZaloPayController.createPayment);
router.post('/callback',ZaloPayController.callback);
router.post('/check-status-order',ZaloPayController.check_status_order)
router.get('/redirect-from-zalopay',ZaloPayController.redirect_from_zalopay)

module.exports = router; 