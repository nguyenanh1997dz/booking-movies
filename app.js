const express = require('express');
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { pageNotFound, errorHandler } = require('./middleware/errorHandler');
const dotenv = require("dotenv").config();
const compression = require('compression');
const axios = require('axios');
const app = express();

// import routes
const authRoute = require('./routes/authRoute')
const movieRoute = require('./routes/moviesRoute')
const genreRoute = require('./routes/genreRoute')
const cinemaRoute = require('./routes/cinemaRoute')
const branchRoute = require('./routes/branchRoute')
const roomRoute = require('./routes/roomRoute')
const interestRoute = require('./routes/interestRoute')
const bookRoute = require('./routes/bookRoute')
const uploadImgRoute = require('./routes/uploadImageRoute')
const vnpayRoute = require('./routes/vnpayRoute')
//database
require('./config/db')
// server configuration
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.BASE_CLIENT_URL,
    credentials: true
}));
app.use(morgan("dev"));
app.use(compression());
// routes

// dùng để ngăn render tự sleep


app.use("/api/v1/auth", authRoute);
app.use("/api/v1/movie", movieRoute);
app.use("/api/v1/genre", genreRoute);
app.use("/api/v1/cinema", cinemaRoute);
app.use("/api/v1/branch", branchRoute);
app.use("/api/v1/room", roomRoute);
app.use("/api/v1/interest", interestRoute);
app.use("/api/v1/book", bookRoute);
app.use("/api/v1/img", uploadImgRoute);
app.use("/api/v1/vnpay", vnpayRoute);
// ping server when render sleep
app.get("/ping",(req, res) => {
    return res.json({
        message:"Ping server"
    })
});
// error handler
app.use('*', pageNotFound)
app.use(errorHandler)