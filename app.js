const express = require('express');
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { pageNotFound , errorHandler} = require('./middleware/errorHandler');
const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT ;
const authRoute = require('./routes/authRoute')
//database
require('./config/db')
// server configuration
app.listen(port, () => {
    console.log("Server listening on port " + port);
});
//middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    credentials: true 
}));

app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", authRoute);

// error handler
app.use('*', pageNotFound)
app.use(errorHandler)


