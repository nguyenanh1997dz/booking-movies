const express = require("express");
const RoomController = require("../controller/roomCtrl");
const router = express.Router();


router.put('/', RoomController.uploadRoom)

module.exports = router