const express = require("express");
const RoomController = require("../controller/roomCtrl");
const router = express.Router();

router.get('/',RoomController.getAllRoom)
router.post('/',RoomController.createRoom)

module.exports = router