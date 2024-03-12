const asyncHandler = require("express-async-handler");
const Interest = require("../model/interestModel")
const Movie = require("../model/movieModel")
const branch = require("../model/branchModel")
const Room = require("../model/roomModel")

class InterestController {
    static createInterest = asyncHandler(async (req, res) => {
        try {
            const newInterest = await Interest.create(req.body)
            return res.status(200).json({
                message: "Tạo suất chiếu phim thành công",
                data: newInterest
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình tạo suất chiếu phim " + error.message
            })
        }
    })
    static getInterest = asyncHandler(async (req, res) => {
        try {
            let query = {};
            const currentDate = new Date();

            if (req.query.day) {
                const dayOffset = parseInt(req.query.day);
                const targetDate = new Date(currentDate);
                targetDate.setDate(currentDate.getDate() + dayOffset);

                const nextDate = new Date(currentDate);
                nextDate.setDate(currentDate.getDate() + dayOffset + 1);

                query.startTime = {
                    $gte: targetDate,
                    $lt: nextDate
                };
            }

            const interests = await Interest.find(query).populate("movie", "name").populate("branch", "name").populate("room", "name");

            return res.status(200).json({
                message: "Thành công",
                data: interests
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình lấy dữ liệu suất chiếu phim " + error.message
            });
        }
    });




    static updateInterest = asyncHandler(async (req, res) => {
        const { seats } = req.body;
        try {
            const interestId = req.params.id;
            const updatedInterest = await Interest.findByIdAndUpdate(interestId, { seats });
            return res.status(200).json({
                message: "Cập nhật suất chiếu phim thành công",
                data: updatedInterest
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình cập nhật suất chiếu phim " + error.message
            });
        }
    });

}
module.exports = InterestController;