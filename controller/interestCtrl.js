const asyncHandler = require("express-async-handler");
const Interest = require("../model/interestModel")
const Movie = require("../model/movieModel")
const branch = require("../model/branchModel")
const Room = require("../model/roomModel")

class InterestController {
    static createInterest = asyncHandler(async (req, res) => {
        try {
            const startTime = new Date(req.body.startTime);
            const movieDuration = await Movie.findById(req.body.movie).select('duration');
            const endTime = new Date(startTime.getTime() + movieDuration.duration * 60000);

            const bStartTime = new Date(startTime.getTime() - 10 * 60000);

            const aEndTime = new Date(endTime.getTime() + 10 * 60000);

            const existingInterest = await Interest.find({
                $or: [
                    {
                        $and: [
                            { startTime: { $gte: bStartTime } },
                            { startTime: { $lte: aEndTime } }
                        ]
                    },
                    {
                        $and: [
                            { endTime: { $gte: bStartTime } },
                            { endTime: { $lte: aEndTime } }
                        ]
                    }
                ],

                branch: req.body.branch,
                room: req.body.room
            });

            console.log(existingInterest)

            if (existingInterest.length != 0) {
                return res.status(400).json({
                    message: "Suất chiếu đã tồn tại trong khoảng thời gian này."
                });
            }

            const data = {
                ...req.body,
                endTime: endTime.toISOString()
            }

            const newInterest = await Interest.create(data);
            return res.status(200).json({
                message: "Tạo suất chiếu phim thành công",
                data: newInterest
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình tạo suất chiếu phim " + error.message
            });
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