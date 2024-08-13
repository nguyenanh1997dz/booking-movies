const asyncHandler = require("express-async-handler");
const Book = require("../model/bookModel");
const User = require("../model/userModel");
const Food = require("../model/foodModel");
const Interest = require("../model/interestModel");
const moment = require("moment");
const paymentMethodsAray = ["Tiền mặt", "VNPAY", "ZALOPAY"];
const sendEmail = require("../utils/sendMail");
const axios = require("axios");
const { default: mongoose } = require("mongoose");
const { v4: uuidv4 } = require("uuid");
class BookController {
  static createBook = asyncHandler(async (req, res) => {
    const { email, discountValue } = req.body;
    try {
      validateInput(req);
      const newBook = new Book(req.body);
      const interest = await checkInterestStatus(newBook);
      checkDuplicateSeats(newBook, interest);
      interest.bookedSeats.push(...newBook.seats);
      newBook.movie = interest.movie;
      newBook.uuid = uuidv4();
      await interest.save();
      await newBook.save();
      const redirectUrl = await savePaymentDetails(
        newBook,
        req.body.paymentMethod,
        interest,
        newBook._id
      );
      return res.redirect(307, redirectUrl);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  });
  static getAllBook = asyncHandler(async (req, res) => {
    const { user, sort = "-createdAt" } = req.query;
    const validQueryFields = ["user", "branch", "interest", "room"];
    try {
      const query = {};
      validQueryFields.forEach((field) => {
        if (req.query[field]) {
          query[field] = req.query[field];
        }
      });
      const books = await Book.find(query).sort(sort);
      return res.status(200).json({
        message: "Thành công",
        data: books,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi trong quá trình lấy dữ liệu đặt vé " + error.message,
      });
    }
  });
  static getBookById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const books = await Book.findById(id);
      return res.status(200).json({
        message: "Thành công",
        data: books,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi trong quá trình lấy dữ liệu đặt vé " + error.message,
      });
    }
  });
  static confirmCashPaymentSuccess = asyncHandler(async (req, res) => {
    const { bookId } = req.query;
    const book = await Book.findById(bookId);
    const user = await User.findOne({ email: book.email });
    if (!book) {
      throw new Error("Không tìm thấy vé");
    }
    for (const extra of book.extras) {
      const { itemId, quantity, price } = extra;
      const food = await Food.findById(itemId);
      if (!food) {
        console.error(`Food item with ID ${itemId} not found.`);
        continue;
      }
      const newQuantity = food.quantity - quantity;
      const newTotalSales = food.totalSales + quantity;
      const newTotalSalesPrice = food.totalSalesPrice + price;
      await Food.findByIdAndUpdate(itemId, {
        totalSales: newTotalSales,
        totalSalesPrice: newTotalSalesPrice,
      });
    }
    book.payment.method = "Tiền mặt";
    book.payment.status = "Đã thanh toán";
    await book.save();
    if (user) {
      await User.findByIdAndUpdate(user._id, { $push: { bookings: book._id } });
    }
    return res.json(book);
  });
  static confirmVnpayPaymentSuccess = asyncHandler(async (req, res) => {
    const { bookId } = req.query;
    console.log(bookId);

    const book = await Book.findById(bookId);
    const user = await User.findOne({ email: book.email });
    for (const extra of book.extras) {
      const { itemId, quantity, price } = extra;
      const food = await Food.findById(itemId);
      if (!food) {
        console.error(`Food item with ID ${itemId} not found.`);
        continue;
      }
      const newQuantity = food.quantity - quantity;
      const newTotalSales = food.totalSales + quantity;
      const newTotalSalesPrice = food.totalSalesPrice + price;
      await Food.findByIdAndUpdate(itemId, {
        totalSales: newTotalSales,
        totalSalesPrice: newTotalSalesPrice,
      });
    }
    if (book.payment.status !== "Đã thanh toán") {
      book.payment.method = "VNPAY";
      book.payment.status = "Đã thanh toán";
      await book.save();
      if (user) {
        await User.findByIdAndUpdate(user._id, {
          $push: { bookings: book._id },
        });
      }
    }
    return res.json({
      url: `${process.env.BASE_CLIENT_URL}/thankyou/${bookId}`,
    });
  });
  static confirmCancelBookMovie = asyncHandler(async (req, res) => {
    try {
      const { bookId } = req.query;
      console.log(bookId);
      const book = await Book.findById(bookId);
      const seats = book.seats;
      const formattedSeats = seats.map((seat) => String(seat));
      await Interest.findOneAndUpdate(
        { _id: book.interest._id },
        { $pull: { bookedSeats: { $in: formattedSeats } } }
      );
      book.payment.status = "Đã hủy";
      await book.save();
      return res.json({
        url: `${process.env.BASE_CLIENT_URL}`,
      });
    } catch (error) {
      console.error("Error in confirmCancelBookMovie:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  static allTicket = asyncHandler(async (req, res) => {
    const result = await Book.aggregate([
      {
        $lookup: {
          from: "movies",
          localField: "movie",
          foreignField: "_id",
          as: "movieResult",
        },
      },
      { $unwind: "$movieResult" },

      {
        $lookup: {
          from: "interests",
          localField: "interest",
          foreignField: "_id",
          as: "interestResult",
        },
      },
      { $unwind: "$interestResult" },

      {
        $lookup: {
          from: "rooms",
          localField: "interestResult.room",
          foreignField: "_id",
          as: "roomResult",
        },
      },
      { $unwind: "$roomResult" },

      {
        $lookup: {
          from: "branches",
          localField: "roomResult.branch",
          foreignField: "_id",
          as: "branchResult",
        },
      },
      { $unwind: "$branchResult" },

      // Expand the extras array for processing if it exists
      { $unwind: { path: "$extras", preserveNullAndEmptyArrays: true } },

      // Lookup for extra items
      {
        $lookup: {
          from: "foods", // Collection where extra details are stored
          localField: "extras.itemId",
          foreignField: "_id",
          as: "extraDetails",
        },
      },
      { $unwind: { path: "$extraDetails", preserveNullAndEmptyArrays: true } },

      // Group by the main document and accumulate extra details
      {
        $group: {
          _id: "$_id",
          uuid: { $first: "$uuid" },
          movieInfo: {
            $first: {
              name: "$movieResult.name",
              img: "$movieResult.image.url",
            },
          },
          showDetails: {
            $first: {
              cinemaName: "$branchResult.name",
              address: "$branchResult.address",
              screenRoom: "$roomResult.name",
              timeStart: "$interestResult.startTime",
              timeEnd: "$interestResult.endTime",
              status: "$interestResult.status",
              ticketPrice: "$interestResult.price",
            },
          },
          email: { $first: "$email" },
          extras: {
            $push: {
              quantity: "$extras.quantity",
              name: "$extraDetails.name",
              price: "$extras.price",
            },
          },
          payment: { $first: "$payment" },
          seats: { $first: "$seats" },
          dateBooked: { $first: "$createdAt" },
          totalAmount: { $first: "$price" },
          discountValue: {
            $first: {
              $cond: {
                if: { $eq: ["$discountValue", 0] },
                then: "Không sử dụng",
                else: "$discountValue",
              },
            },
          },
        },
      },

      // Ensure extras is an empty array if no extras exist
      {
        $addFields: {
          extras: {
            $cond: {
              if: {
                $and: [
                  { $eq: [{ $size: "$extras" }, 1] },
                  {
                    $eq: [
                      { $type: { $arrayElemAt: ["$extras", 0] } },
                      "object",
                    ],
                  },
                ],
              },
              then: [],
              else: "$extras",
            },
          },
        },
      },
    ]);
    return res.json(result);
  });
  static ticketById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({ message: "Thiếu thông tin" });
    }
    const result = await Book.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "movie",
          foreignField: "_id",
          as: "movieResult",
        },
      },
      { $unwind: "$movieResult" },

      {
        $lookup: {
          from: "interests",
          localField: "interest",
          foreignField: "_id",
          as: "interestResult",
        },
      },
      { $unwind: "$interestResult" },

      {
        $lookup: {
          from: "rooms",
          localField: "interestResult.room",
          foreignField: "_id",
          as: "roomResult",
        },
      },
      { $unwind: "$roomResult" },

      {
        $lookup: {
          from: "branches",
          localField: "roomResult.branch",
          foreignField: "_id",
          as: "branchResult",
        },
      },
      { $unwind: "$branchResult" },

      // Expand the extras array for processing if it exists
      { $unwind: { path: "$extras", preserveNullAndEmptyArrays: true } },

      // Lookup for extra items
      {
        $lookup: {
          from: "foods", // Collection where extra details are stored
          localField: "extras.itemId",
          foreignField: "_id",
          as: "extraDetails",
        },
      },
      { $unwind: { path: "$extraDetails", preserveNullAndEmptyArrays: true } },

      // Group by the main document and accumulate extra details
      {
        $group: {
          _id: "$_id",
          uuid: { $first: "$uuid" },
          movieInfo: {
            $first: {
              name: "$movieResult.name",
              img: "$movieResult.image.url",
            },
          },
          showDetails: {
            $first: {
              cinemaName: "$branchResult.name",
              address: "$branchResult.address",
              screenRoom: "$roomResult.name",
              timeStart: "$interestResult.startTime",
              timeEnd: "$interestResult.endTime",
              status: "$interestResult.status",
              ticketPrice: "$interestResult.price",
            },
          },
          email: { $first: "$email" },
          extras: {
            $push: {
              quantity: "$extras.quantity",
              name: "$extraDetails.name",
              price: "$extras.price",
            },
          },
          payment: { $first: "$payment" },
          seats: { $first: "$seats" },
          dateBooked: { $first: "$createdAt" },
          totalAmount: { $first: "$price" },
          discountValue: {
            $first: {
              $cond: {
                if: { $eq: ["$discountValue", 0] },
                then: "Không sử dụng",
                else: "$discountValue",
              },
            },
          },
        },
      },

      // Ensure extras is an empty array if no extras exist
      {
        $addFields: {
          extras: {
            $cond: {
              if: {
                $and: [
                  { $eq: [{ $size: "$extras" }, 1] },
                  {
                    $eq: [
                      { $type: { $arrayElemAt: ["$extras", 0] } },
                      "object",
                    ],
                  },
                ],
              },
              then: [],
              else: "$extras",
            },
          },
        },
      },
    ]);
    return res.json(result[0] || {});
  });
  static userTicket = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const user = await User.findById(id);
    const result = await Book.aggregate([
      {
        $match: {
          email: user?.email,
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "movie",
          foreignField: "_id",
          as: "movieResult",
        },
      },
      { $unwind: "$movieResult" },

      {
        $lookup: {
          from: "interests",
          localField: "interest",
          foreignField: "_id",
          as: "interestResult",
        },
      },
      { $unwind: "$interestResult" },

      {
        $lookup: {
          from: "rooms",
          localField: "interestResult.room",
          foreignField: "_id",
          as: "roomResult",
        },
      },
      { $unwind: "$roomResult" },

      {
        $lookup: {
          from: "branches",
          localField: "roomResult.branch",
          foreignField: "_id",
          as: "branchResult",
        },
      },
      { $unwind: "$branchResult" },

      // Expand the extras array for processing if it exists
      { $unwind: { path: "$extras", preserveNullAndEmptyArrays: true } },

      // Lookup for extra items
      {
        $lookup: {
          from: "foods", // Collection where extra details are stored
          localField: "extras.itemId",
          foreignField: "_id",
          as: "extraDetails",
        },
      },
      { $unwind: { path: "$extraDetails", preserveNullAndEmptyArrays: true } },

      // Group by the main document and accumulate extra details
      {
        $group: {
          _id: "$_id",
          uuid: { $first: "$uuid" },
          movieInfo: {
            $first: {
              name: "$movieResult.name",
              img: "$movieResult.image.url",
            },
          },
          showDetails: {
            $first: {
              cinemaName: "$branchResult.name",
              address: "$branchResult.address",
              screenRoom: "$roomResult.name",
              timeStart: "$interestResult.startTime",
              timeEnd: "$interestResult.endTime",
              status: "$interestResult.status",
              ticketPrice: "$interestResult.price",
            },
          },
          email: { $first: "$email" },
          extras: {
            $push: {
              quantity: "$extras.quantity",
              name: "$extraDetails.name",
              price: "$extras.price",
            },
          },
          payment: { $first: "$payment" },
          seats: { $first: "$seats" },
          dateBooked: { $first: "$createdAt" },
          totalAmount: { $first: "$price" },
          discountValue: {
            $first: {
              $cond: {
                if: { $eq: ["$discountValue", 0] },
                then: "Không sử dụng",
                else: "$discountValue",
              },
            },
          },
        },
      },

      // Ensure extras is an empty array if no extras exist
      {
        $addFields: {
          extras: {
            $cond: {
              if: {
                $and: [
                  { $eq: [{ $size: "$extras" }, 1] },
                  {
                    $eq: [
                      { $type: { $arrayElemAt: ["$extras", 0] } },
                      "object",
                    ],
                  },
                ],
              },
              then: [],
              else: "$extras",
            },
          },
        },
      },
    ]);
    return res.json(result);
  });
  static ticketByUuid = asyncHandler(async (req, res) => {
    const { uuid } = req.params;
    const result = await Book.aggregate([
      {
        $match: {
          movie: { $exists: true, $ne: "" },
          uuid: uuid,
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "movie",
          foreignField: "_id",
          as: "movieResult",
        },
      },
      { $unwind: "$movieResult" },

      {
        $lookup: {
          from: "interests",
          localField: "interest",
          foreignField: "_id",
          as: "interestResult",
        },
      },
      { $unwind: "$interestResult" },

      {
        $lookup: {
          from: "rooms",
          localField: "interestResult.room",
          foreignField: "_id",
          as: "roomResult",
        },
      },
      { $unwind: "$roomResult" },

      {
        $lookup: {
          from: "branches",
          localField: "roomResult.branch",
          foreignField: "_id",
          as: "branchResult",
        },
      },
      { $unwind: "$branchResult" },

      {
        $project: {
          _id: 1,
          movieInfo: {
            name: "$movieResult.name",
            img: "$movieResult.image.url",
          },
          showDetails: {
            cinemaName: "$branchResult.name",
            address: "$branchResult.address",
            screenRoom: "$roomResult.name",
            timeStart: "$interestResult.startTime",
            timeEnd: "$interestResult.endTime",
            status: "$interestResult.status",
          },
          email: 1,
          extras: 1,
          payment: 1,
          seats: 1,
          dateBooked: "$createdAt",
          totalAmount: "$price",
          discountValue: {
            $cond: {
              if: { $eq: ["$discountValue", 0] },
              then: "Không sử dụng",
              else: "$discountValue",
            },
          },
          discountAmount: {
            $cond: {
              if: { $eq: ["$discountValue", 0] },
              then: 0,
              else: {
                $multiply: [
                  "$price",
                  {
                    $divide: ["$discountValue", 100],
                  },
                ],
              },
            },
          },
        },
      },
    ]);
    return res.json(result[0] || {});
  });
}

function validateInput(req) {
  const { paymentMethod, email, price } = req.body;
  if (!paymentMethod || !email || !price) {
    throw new Error("Thiếu thông tin đầu vào");
  }
  if (!paymentMethodsAray.includes(paymentMethod)) {
    throw new Error("Phương thức thanh toán không hợp lệ");
  }
}

async function checkInterestStatus(newBook) {
  const interest = await Interest.findById(newBook.interest);
  if (!interest || interest.status !== "Chưa bắt đầu") {
    throw new Error(
      "Đặt vé thất bại: Suất chiếu không tồn tại hoặc đã hết thời gian đặt vé"
    );
  }
  return interest;
}

function checkDuplicateSeats(newBook, interest) {
  const duplicateSeats = newBook.seats.filter((seat) =>
    interest.bookedSeats.includes(seat)
  );
  if (duplicateSeats.length > 0) {
    throw new Error(
      `Đặt vé thất bại: Ghế ${duplicateSeats.join(", ")} đã có người đặt`
    );
  }
}

// Hàm lưu thông tin thanh toán
async function savePaymentDetails(
  newBook,
  paymentMethod,
  interest,
  bookId,
  email
) {
  newBook.payment.method = paymentMethod;
  newBook.payment.details = {};
  if (paymentMethod === "Tiền mặt") {
    return `/api/v1/book/cash?bookId=${bookId}`;
  }
  if (paymentMethod === "VNPAY") {
    return `/api/v1/vnpay?amount=${newBook.price}&bankCode=${paymentMethod}&orderId=${newBook._id}`;
  }
  if (paymentMethod === "ZALOPAY") {
    return `/api/v1/zalopay?amount=${newBook.price}&orderId=${newBook._id}&email=${newBook.email}`;
  }
}
module.exports = BookController;
