const asyncHandler = require("express-async-handler");
const Interest = require("../model/interestModel")
const Movie = require("../model/movieModel")
const branch = require("../model/branchModel")
const Room = require("../model/roomModel")

class InterestController {
    static createInterest = asyncHandler(async (req, res) => {
        try {
            const startTime = req.body.startTime

            const movieDuration = await Movie.findById(req.body.movie).select('duration');
            const endTime = startTime + movieDuration.duration * 60000
            console.log(startTime)
            console.log(endTime)
            const bStartTime = startTime - 10 * 60000

            const aEndTime = endTime + 10 * 60000

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
                endTime: endTime
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
        const vietnamTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });

        try {

            const interests = await Interest.find(query).populate("movie", "name").populate("room", "name");

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

    static getInterestn = asyncHandler(async (req, res) => {
        const vietnamTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
        const vietnamTimeInMilliseconds = new Date(vietnamTime).getTime(); // Chuyển sang mili giây

        try {
            const interests = await Interest.aggregate([

                {
                    $addFields: {
                        startDate: {
                            $toDate: {
                                $toLong: "$startTime"
                            }
                        }
                    }
                },

                {
                    $group: {
                        _id: {
                            date: {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: "$startDate"
                                }
                            },
                            movie: "$movie"
                        },
                        interests: {
                            $push: {
                                _id: "$_id",
                                room: "$room",
                                startTime: "$startTime",
                                endTime: "$endTime",
                                bookedSeats: "$bookedSeats"
                            }
                        }
                    }
                },

                {
                    $group: {
                        _id: "$_id.date",
                        movies: {
                            $push: {
                                movie: "$_id.movie",
                                interests: "$interests"
                            }
                        }
                    }
                }
            ]);

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
        const { bookedSeats } = req.body;
        console.log(bookedSeats)
        try {
            const interestId = req.params.id;
            const interest = await Interest.findById(interestId);

            if (interest.bookedSeats.includes(bookedSeats)) {
                return res.status(400).json({
                    message: "Ghế đã được đặt trước đó."
                });
            }

            interest.bookedSeats.push(bookedSeats)
            interest.save()


            return res.status(200).json({
                message: "Cập nhật ghế thành công",
                data: interest
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình cập nhật ghế " + error.message
            });
        }
    });

}
module.exports = InterestController;