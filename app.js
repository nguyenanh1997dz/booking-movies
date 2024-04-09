const express = require('express');
const app = express();

const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { pageNotFound, errorHandler } = require('./middleware/errorHandler');
const indexRoute = require('./routes/indexRoute')
const dotenv = require("dotenv").config();
const compression = require('compression');
const bodyParser = require('body-parser');

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
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware Morgan
app.use(morgan("dev"));

// Xử lý yêu cầu Preflight OPTIONS
app.options('*', cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(compression());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// routes
app.use(indexRoute)

// dùng để ngăn render tự sleep
app.get("/ping", (req, res) => {
    return res.json({
        message: "Ping server"
    })
});
// error handler
app.use('*', pageNotFound)
app.use(errorHandler)