const asyncHandler = require("express-async-handler");
const Room = require("../model/roomModel");
const Branch = require("../model/branchModel"); // Import Branch model

class RoomController {
    static getRoom = asyncHandler(async (req, res) => {
        try {
            const room = await Room.find()
            return res.status(200).json({
                message: "Thành công",
                data: room
            });

        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình đặt vé " + error.message
            })
        }
    })
    static getRoomById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const room = await Room.findById(id)
            return res.status(200).json({
                message: "Thành công",
                data: room
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình đặt vé " + error.message
            })
        }
    })
    static uploadRoom = asyncHandler(async (req, res) => {
        try {
            const roomId = req.params.id
            const room = await Room.findOne({ _id: roomId })
            room.push(req.body)
            await room.save()
            return res.status(200).json({
                message: "Đặt vé thành công",
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình đặt vé " + error.message
            })
        }
    })
    static deleteRoom = asyncHandler(async (req, res) => {
        try {
            const roomId = req.params.id
            const branch = await Branch.findOne({ rooms: roomId })
            if (!branch) {
                return res.status(404).json({ message: "Không tìm thấy chi nhánh chứa phòng này" })
            }
            const index = branch.rooms.indexOf(roomId)
            if (index !== -1) {
                branch.rooms.splice(index, 1)
            }

            await Room.findByIdAndDelete(roomId);
            await branch.save()

            return res.status(200).json({
                message: "Xóa phòng thành công",
                data: branch
            });

        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình xóa phòng chiếu " + error.message
            })
        }
    })
}

module.exports = RoomController;