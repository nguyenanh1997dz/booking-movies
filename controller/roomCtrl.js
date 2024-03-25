const asyncHandler = require("express-async-handler");
const Room = require("../model/roomModel");
const Branch = require("../model/branchModel"); // Import Branch model

class RoomController {
    static createRoom = asyncHandler(async (req, res) => {
        try {
            const { branch, name } = req.body;
            const existingRoom = await Room.findOne({ branch: branch, name });

            if (existingRoom) {
                return res.status(400).json({
                    message: "Phòng đã tồn tại trong chi nhánh này"
                });
            }
            const newRoom = await Room.create(req.body);
            await Branch.findByIdAndUpdate(branch, { $push: { rooms: newRoom._id } });

            return res.status(200).json({
                message: "Tạo phòng thành công",
                data: newRoom
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình tạo phòng " + error.message
            });
        }
    });
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
    static deleteRoom = asyncHandler(async (req, res) => {
        try {
            const roomId = req.params.id;
            const branch = await Branch.findOne({ rooms: roomId });
            if (branch) {
                await Branch.findByIdAndUpdate(branch._id, { $pull: { rooms: roomId } });
            }
            await Room.findByIdAndDelete(roomId);
            return res.status(200).json({
                message: "Xóa phòng thành công",
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình xóa phòng: " + error.message
            });
        }
    })

}

module.exports = RoomController;