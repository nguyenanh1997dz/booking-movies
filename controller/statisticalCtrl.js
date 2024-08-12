const asyncHandler = require("express-async-handler");
const Interest = require("../model/interestModel");
const Book = require("../model/bookModel");
const mongoose = require("mongoose");
class StatisticalController {
  static movieRevenue = asyncHandler(async (req, res) => {
    
    const matchCondition = {
       
        createdAt: {
          $gte: new Date("2024-07-10T00:00:00Z"),
          $lt: new Date("2024-08-31T23:59:59Z"),
        }
    };
    const result = await Book.aggregate([
      {$match: matchCondition},
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
          _id: "$interestDetails.movie",
          totalRevenue: {
            $sum: "$price",
          },
          totalTicketsRevenue: {
            $sum: {
              $multiply: [{ $size: "$seats" }, "$interestDetails.price"],
            },
          },
          totalExtrasRevenue: {
            $sum: { $ifNull: [{ $sum: "$extras.price" }, 0] },
          },
          totalSeatsSold: {
            $sum: { $size: "$seats" },
          },
          totaldiscountValue: {
            $sum: {
              $multiply: [
                "$price", // Giá gốc của hóa đơn
                { $divide: ["$discountValue", 100] } 
              ]
            }
          },
          totalTicketsSold: {
            $sum: 1,
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
          _id: 1,
          movie: "$movieDetails.name",
          totalRevenue: 1,
          totalTicketsRevenue: 1,
          totalExtrasRevenue: 1,
          totalTicketsSold: 1,
          totalSeatsSold: 1,
          totaldiscountValue: 1,
        },
      },
    ]);

    return res.json(result);
  });
  static branchRevenue = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const matchCondition = {};

    if (startDate && endDate) {
      matchCondition.createdAt = {
        $gte: new Date(startDate), // Ngày bắt đầu
        $lte: new Date(endDate), // Ngày kết thúc
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
        $lookup: {
          from: "rooms",
          localField: "interestDetails.room",
          foreignField: "_id",
          as: "roomDetails",
        },
      },
      { $unwind: "$roomDetails" },
      {
        $lookup: {
          from: "branches",
          localField: "roomDetails.branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      { $unwind: "$branchDetails" },
      {
        $group: {
          _id: "$branchDetails._id",
          branchName: { $first: "$branchDetails.name" },
          totalRevenue: {
            $sum: "$price",
          },
          totalTicketsRevenue: {
            $sum: {
              $multiply: [{ $size: "$seats" }, "$interestDetails.price"],
            },
          },
          totalExtrasRevenue: {
            $sum: { $ifNull: [{ $sum: "$extras.price" }, 0] },
          },
          totalTicketsSold: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          branchName: 1,
          totalRevenue: 1,
          totalTicketsRevenue: 1,
          totalExtrasRevenue: 1,
          totalTicketsSold: 1,
        },
      },
    ]);

    return res.json(result);
  });
  static branchMovieRevenueDetail = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const { branchId } = req.params;

    const matchCondition = {};
    if (startDate && endDate) {
      matchCondition.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
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
        $lookup: {
          from: "rooms",
          localField: "interestDetails.room",
          foreignField: "_id",
          as: "roomDetails",
        },
      },
      { $unwind: "$roomDetails" },
      {
        $lookup: {
          from: "branches",
          localField: "roomDetails.branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      { $unwind: "$branchDetails" },
      {
        $match: {
          "branchDetails._id": new mongoose.Types.ObjectId(branchId),
        },
      },
      {
        $group: {
          _id: {
            branch: "$branchDetails._id",
            movie: "$interestDetails.movie",
          },
          branchName: { $first: "$branchDetails.name" },
          movieName: { $first: "$interestDetails.movie" },
          totalRevenue: {
            $sum: "$price",
          },
          totalTicketsRevenue: {
            $sum: {
              $multiply: [{ $size: "$seats" }, "$interestDetails.price"],
            },
          },
          totalExtrasRevenue: {
            $sum: { $ifNull: [{ $sum: "$extras.price" }, 0] },
          },
          totalTicketsSold: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "_id.movie",
          foreignField: "_id",
          as: "movieDetails",
        },
      },
      { $unwind: "$movieDetails" },
      {
        $project: {
          _id: 1,
          branchName: 1,
          movie: "$movieDetails.name",
          totalRevenue: 1,
          totalTicketsRevenue: 1,
          totalExtrasRevenue: 1,
          totalTicketsSold: 1,
        },
      },
    ]);

    console.log(result);
    return res.json(result);
  });
}
module.exports = StatisticalController;
