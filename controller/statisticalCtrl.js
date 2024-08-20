const asyncHandler = require("express-async-handler");
const Interest = require("../model/interestModel");
const Book = require("../model/bookModel");
const mongoose = require("mongoose");
class StatisticalController {
  static chartStatistical = asyncHandler(async (req, res) => {
    const result = await Book.aggregate([
      {
        $match: {
          "payment.status": "Đã thanh toán",
        },
      },
      {
        $unwind: { path: "$extras", preserveNullAndEmptyArrays: true },
      },
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
          _id: {
            day: { $dateToString: { format: "%m/%d/%Y", date: "$createdAt" } },
          },
          totalTicketPrice: {
            $sum: {
              $multiply: [{ $size: "$seats" }, "$interestDetails.price"],
            },
          },

          finalAmount: { $sum: "$totalPrice" },
          totalExtrasPrice: {
            $sum: { $ifNull: [{ $sum: "$extras.price" }, 0] },
          },
          totalDiscountAmount: {
            $sum: {
              $cond: {
                if: { $eq: ["$discountValue", 0] },
                then: 0,
                else: {
                  $multiply: [
                    {
                      $add: [
                        "$price",
                        { $multiply: ["$extras.quantity", "$extras.price"] },
                      ],
                    },
                    { $divide: ["$discountValue", 100] },
                  ],
                },
              },
            },
          },
          totalAmount: {
            $sum: {
              $add: [
                "$price",
                { $multiply: ["$extras.quantity", "$extras.price"] },
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          day: "$_id.day",
          totalTicketPrice: 1,
          totalExtrasPrice: 1,
          totalDiscountAmount: 1,
          finalAmount: 1,
        },
      },
      {
        $sort: { day: 1 },
      },
    ]);
    return res.json(result);
  });
  static revenue = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const result = await Book.aggregate([
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
  static movieSalesSummary = asyncHandler(async (req, res) => {
    const result = await Book.aggregate([
      {
        $match: {
          "payment.status": "Đã thanh toán",
        },
      },
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
          from: "movies",
          localField: "movie",
          foreignField: "_id",
          as: "movieDetails",
        },
      },
      { $unwind: "$movieDetails" },
      {
        $group: {
          _id: "$movieDetails._id",
          movieName: { $first: "$movieDetails.name" },
          totalSeats: { $sum: { $size: "$seats" } },
          totalTicketPrice: {
            $sum: {
              $multiply: [{ $size: "$seats" }, "$interestDetails.price"],
            },
          },
          totalTicketsSold: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 1,
          movieName: 1,
          totalSeats: 1,
          totalTicketPrice: 1,
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
