const asyncHandler = require("express-async-handler");
const Room = require("../model/roomModel");

class RoomController {
    static createRoom  = asyncHandler(async (req,res) =>{
        try {
           const newRoom = await  Room.create(req.body)
            return res.status(200).json({
                message: "Tạo phòng chiếu thành công",
                data: newRoom
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình tạo phòng chiếu" + error.message
            })
        }
    })
    static getAllRoom  = asyncHandler(async (req,res) =>{
        try {
           const allRoom = await  Room.find().populate("branch","name")
            return res.status(200).json({
                message: "Thành công",
                data: allRoom
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi lấy phòng chiếu " + error.message
            })
        }
    })
}
module.exports = RoomController;