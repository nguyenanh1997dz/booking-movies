const express = require("express");
const CouponController = require("../controller/couponCtrl");
const router = express.Router();

router.get('/', CouponController.getAll)
router.post('/', CouponController.create)
router.post("/check",CouponController.checkCode)
module.exports = router;