const asyncHandler = require("express-async-handler");
const Branch = require("../model/branchModel");

class BranchController {
    static createBranch = asyncHandler(async (req, res) => {
        try {
            const newBranch = await Branch.create(req.body)
            return res.status(200).json({
                message: "Tạo chi nhánh rạp thành công",
                data: newBranch
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình tạo chi nhánh rạp" + error.message
            })
        }
    })
    static getAllBranch = asyncHandler(async (req, res) => {
        try {
            const allBranch = await Branch.find().populate("rooms")
            return res.status(200).json({
                message: "Thành công",
                data: allBranch
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi lấy chi nhánh rạp " + error.message
            })
        }
    })
    static getBranchByName = asyncHandler(async (req, res) => {
        const { name } = req.query;
        try {
            const branches = await Branch.find({ name: { $regex: name, $options: 'i' } });
            if (!branches || branches.length === 0) {
                return res.status(404).json({
                    message: "Không tìm thấy chi nhánh rạp"
                });
            }
            return res.status(200).json({
                message: "Thành công",
                data: branches
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi tìm chi nhánh rạp " + error.message
            });
        }
    });
    static getBranchByIdCinema = asyncHandler(async (req, res) => {
        const { id } = req.params
        try {
            const branche = await Branch.find({ cinema: id }).populate("rooms");
            if (!branche || branche.length === 0) {
                return res.status(404).json({
                    message: "Không tìm thấy chi nhánh rạp"
                });
            }
            return res.status(200).json({
                message: "Thành công",
                data: branche
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi tìm chi nhánh rạp " + error.message
            });
        }
    })
    static getBranchById = asyncHandler(async (req, res) => {
        const { id } = req.params
        try {
            const branche = await Branch.findOne({ _id: id }).populate("rooms");
            if (!branche || branche.length === 0) {
                return res.status(404).json({
                    message: "Không tìm thấy chi nhánh rạp"
                });
            }
            return res.status(200).json({
                message: "Thành công",
                data: branche
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi tìm chi nhánh rạp " + error.message
            });
        }
    })
}
module.exports = BranchController