const express = require("express");
const Food = require("../model/foodModel");

const router = express.Router();
router.get('/',  (req, res) => {
    res.send("Hello")
})


module.exports = router;