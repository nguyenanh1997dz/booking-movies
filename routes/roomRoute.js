const express = require("express");
const RoomController = require("../controller/roomCtrl");
const router = express.Router();

router.get('/', RoomController.getRoom)
router.post('/', RoomController.createRoom)
router.get('/:id', RoomController.getRoomById)
router.put('/', RoomController.updateRoom)
router.delete('/:id', RoomController.deleteRoom)
module.exports = router