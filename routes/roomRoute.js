const express = require("express");
const RoomController = require("../controller/roomCtrl");
const router = express.Router();
const { authMiddleware ,isAdmin} = require("../middleware/authMiddlewere");
router.get('/', RoomController.getRoom)
router.post('/',authMiddleware,isAdmin, RoomController.createRoom)
router.get('/:id', RoomController.getRoomById)
router.put('/',authMiddleware,isAdmin, RoomController.updateRoom)
router.delete('/:id',authMiddleware,isAdmin, RoomController.deleteRoom)
module.exports = router