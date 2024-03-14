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
