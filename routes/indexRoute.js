const express = require("express");
const router = express.Router();

const authRoute = require('./authRoute')
const movieRoute = require('./moviesRoute')
const genreRoute = require('./genreRoute')
const cinemaRoute = require('./cinemaRoute')
const branchRoute = require('./branchRoute')
const roomRoute = require('./roomRoute')
const interestRoute = require('./interestRoute')
const bookRoute = require('./bookRoute')
const vnpayRoute = require('./vnpayRoute');
const zaloRoute = require('./zaloPayRoute');
const foodRoute = require('./foodRoute')
const blogRoute = require('./blogRoute')
const contentRoute = require('./contentRoute')
const sliderRoute = require('./sliderRoute')
const couponRoute = require('./couponRoute')
const statisticalRoute = require('./statisticalRoute')
const ticketRoute = require('./ticketRoute')
router.use("/api/v1/auth", authRoute);
router.use("/api/v1/movie", movieRoute);
router.use("/api/v1/genre", genreRoute);
router.use("/api/v1/cinema", cinemaRoute);
router.use("/api/v1/branch", branchRoute);
router.use("/api/v1/room", roomRoute);
router.use("/api/v1/interest", interestRoute);
router.use("/api/v1/book", bookRoute);
router.use("/api/v1/vnpay", vnpayRoute);
router.use("/api/v1/zalopay", zaloRoute);
router.use("/api/v1/food", foodRoute);
router.use("/api/v1/blog", blogRoute);
router.use("/api/v1/content", contentRoute);
router.use("/api/v1/slider", sliderRoute);
router.use("/api/v1/coupon", couponRoute);
router.use("/api/v1/statistical", statisticalRoute);
router.use("/api/v1/ticket", ticketRoute);
module.exports = router;