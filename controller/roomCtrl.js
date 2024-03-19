const asyncHandler = require("express-async-handler");
const Room = require("../model/roomModel");
const Branch = require("../model/branchModel"); // Import Branch model

class RoomController {
    static createRoom = asyncHandler(async (req, res) => {
        try {

            const newRoom = await Room.create(req.body);
            const branchId = req.body.branch;

            const branch = await Branch.findById(branchId);
            if (!branch) {
                return res.status(404).json({ message: "Không tìm thấy chi nhánh" })
            }
            branch.rooms.push(newRoom._id);
            await branch.save();

            return res.status(200).json({
                message: "Tạo phòng chiếu thành công",
                data: newRoom
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình tạo phòng chiếu " + error.message
            })
        }
    })

    static getAllRoom = asyncHandler(async (req, res) => {
        try {
            const allRoom = await Room.find().populate("branch", "name");
            return res.status(200).json({
                message: "Thành công",
                data: allRoom
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi lấy phòng chiếu " + error.message
            });
        }
    });
    static getRoomById = asyncHandler(async (req, res) => {
        const {id} = req.params
        const room = await Room.findOne({_id: id}).populate("branch", "name")
        res.send(room);
    })

    static deleteRoom = asyncHandler(async (req, res) => {
        try {
            const roomId = req.params.id;
            const updateResult = await Branch.updateMany({}, { $pull: { rooms: roomId } });
            if (updateResult.nModified === 0) {
                return res.status(404).json({ message: "Không tìm thấy chi nhánh chứa phòng này" });
            }
            await Room.findByIdAndDelete(roomId);
    
            return res.status(200).json({
                message: "Xóa phòng thành công",
                data: updateResult
            });
    
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình xóa phòng chiếu " + error.message
            });
        }
    })
}

module.exports = RoomController;
