const express = require("express");
const CouponController = require("../controller/couponCtrl");
const router = express.Router();
const { authMiddleware, isAdmin} = require("../middleware/authMiddlewere");
router.get('/', CouponController.getAll)
router.delete('/:id', CouponController.delete)
router.post('/',authMiddleware,isAdmin, CouponController.create)
router.post("/check",CouponController.checkCode)
module.exports = router;