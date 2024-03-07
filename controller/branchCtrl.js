const asyncHandler = require("express-async-handler");
const Branch = require("../model/branchModel");

class BranchController {
    static createBranch  = asyncHandler(async (req,res) =>{
        try {
           const newBranch = await  Branch.create(req.body)
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
    static getAllBranch  = asyncHandler(async (req,res) =>{
        try {
            const allBranch = await Branch.find().populate({
                path: 'cinema',
                select: 'name'
            }).populate('rooms');
            
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
}
module.exports = BranchController