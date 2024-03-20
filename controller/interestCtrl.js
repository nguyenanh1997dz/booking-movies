const asyncHandler = require("express-async-handler");
const Interest = require("../model/interestModel")
const Movie = require("../model/movieModel")
const Branch = require("../model/branchModel")
const Room = require("../model/roomModel")
const mongoose = require('mongoose');



class InterestController {
    static createInterest = asyncHandler(async (req, res) => {
        try {
            const { room, startTime, ...otherField } = req.body

            const newStartTime = new Date(req.body.startTime)
            const movie = await Movie.findById(req.body.movie).select('duration');

            const movieDuration = movie.duration * 60000;
            const endTime = new Date(newStartTime.getTime() + movieDuration);
            console.log(newStartTime, endTime)
            const bStartTime = new Date(newStartTime.getTime() - 9 * 60000)
            const aEndTime = new Date(endTime.getTime() + 9 * 60000)


            const branchId = new mongoose.Types.ObjectId(req.body.branch);
            console.log(branchId)

            const existingInterest = await Interest.aggregate([
                {
                    $lookup: {
                        from: "rooms",
                        localField: "room",
                        foreignField: "_id",
                        as: "room"
                    }
                },

                {
                    $match: {
                        $and: [
                            {
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
                                ]
                            },
                            { "room.name": room },
                            { branch: branchId }

                        ]
                    }
                }
            ]);



            console.log(existingInterest)


            if (existingInterest.length != 0) {
                return res.status(400).json({
                    message: "Suất chiếu đã tồn tại trong khoảng thời gian này."
                });
            }

            const data = {
                ...otherField,
                startTime: newStartTime,
                endTime: endTime
            }
            if (data) {
                const newRoom = await Room.create(
                    { name: room }
                )
                data.room = newRoom
            }

            const newInterest = await Interest.create(data);




            await Branch.findOneAndUpdate(
                { _id: req.body.branch },
                { $push: { interests: newInterest._id } },
                { new: true }
            );


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

            const interests = await Interest.find().populate("movie", "name").populate("room", "name");

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
                    $lookup: {
                        from: 'movies',
                        localField: 'movie',
                        foreignField: '_id',
                        as: 'movie'
                    }
                },
                {
                    $unwind: '$movie'
                },
                {
                    $group: {
                        _id: {
                            branch: '$branch',
                            date: { $dateToString: { format: "%d-%m-%Y", date: "$startTime" } },
                            movie: '$movie.name'
                        },
                        interests: { $push: '$$ROOT' }
                    }
                },
                {
                    $group: {
                        _id: {
                            branch: '$_id.branch',
                            date: '$_id.date'
                        },
                        movies: {
                            $push: {
                                movie: '$_id.movie',
                                interests: '$interests'
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: '$_id.branch',
                        dates: {
                            $push: {
                                date: '$_id.date',
                                movies: '$movies'
                            }
                        }
                    }
                },
                {
                    $project: {
                        branch: '$_id',
                        dates: 1,
                        _id: 0
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

    static getInterestp = asyncHandler(async (req, res) => {


        const movieName = req.params.id;
        console.log(movieName)
        try {

            const showtimes = await Interest.aggregate([
                {
                    $match: { movie: movieName }
                },
            ]);


            return res.status(200).json({
                message: "Thành công",
                data: showtimes
            });
        } catch (error) {
            // Xử lý lỗi nếu có
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