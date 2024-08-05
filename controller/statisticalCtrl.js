const asyncHandler = require("express-async-handler");
const Interest = require("../model/interestModel");
const { ObjectId } = require('mongodb');
class StatisticalController {
    static getAllBlog = asyncHandler(async (req, res) => {
        const result = Interest.aggregate([
            {$match: {
                status: "Đã kết thúc" 
            } },
            
        ])

        return res.json(result);
    })
}
module.exports = StatisticalController