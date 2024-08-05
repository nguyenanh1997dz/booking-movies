const asyncHandler = require("express-async-handler");
const Interest = require("../model/interestModel");
const Book = require("../model/bookModel");
const { ObjectId } = require("mongodb");
class StatisticalController {
  static movieRevenue = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const matchCondition = {
        "payment.status": "Đã thanh toán",
      };
  
      if (startDate && endDate) {
        matchCondition.createdAt = {
          $gte: new Date(startDate),  // Ngày bắt đầu
          $lte: new Date(endDate)    // Ngày kết thúc
        };
      }
  
      const result = await Book.aggregate([
        { $match: matchCondition },
        {
          $lookup: {
            from: "interests",
            localField: "interest",
            foreignField: "_id",
            as: "interestDetails",
          },
        },
        { $unwind: "$interestDetails" },
        {
          $group: {
            _id: "$interestDetails.movie",  // Nhóm theo ID của phim
            totalRevenue: {
              $sum: {
                $subtract: [
                  { $multiply: [{ $size: "$seats" }, "$price"] }, 
                  { $ifNull: ["$discountValue", 0] }
                ],
              },
            },
            totalTicketsSold: {
              $sum: { $size: "$seats" },
            },
          },
        },
        {
          $lookup: {
            from: "movies",
            localField: "_id",
            foreignField: "_id",
            as: "movieDetails",
          },
        },
        { $unwind: "$movieDetails" },
        {
          $project: {
            _id: 0,
            movie: "$movieDetails.name",
            totalRevenue: 1,
            totalTicketsSold: 1,
          },
        },
      ]);
  
      console.log(result);
      return res.json(result);

  });
}
module.exports = StatisticalController;
