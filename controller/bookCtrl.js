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
const {authenticator,totp}  = require("otplib");
const QRCode = require('qrcode');

authenticator.options = {
  step: 300,  // Thời gian sống của mã OTP (giây)
  digits: 4,  // Số chữ số của mã OTP
  window: 1   // Số khoảng thời gian trước và sau thời điểm hiện tại mà OTP có thể được chấp nhận
};
const generateOtp = () => {
  return authenticator.generate(process.env.KEY_SECRET_OTP);
};
const verifyOtp = (otp) => {
  return authenticator.check(otp, process.env.KEY_SECRET_OTP);
};

class BookController {
  static createBook = asyncHandler(async (req, res) => {
    const { email, discountValue ,seats } = req.body;
    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        message: "Thiếu thông tin hoặc seats không phải là mảng hợp lệ",
      });
    }
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
    const result = await Book.aggregate( 
      [
      {
        $match: {
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

  static verifyOtp = asyncHandler(async (req, res) => {
    const { otp, email } = req.body;
    if (!otp || !email) {
      return res.status(400).json({
        message: "Thiếu thông tin.",
      });
    }
    const isValid = verifyOtp(otp);
    
    if (!isValid) {
      const { delta } = authenticator.verify(otp, process.env.KEY_SECRET_OTP);
      
      let errorMessage = "Mã OTP không hợp lệ";
      if (delta) {
        if (delta > 0) {
          errorMessage = `Mã OTP hết hạn, còn lại ${delta} giây`;
        } else {
          errorMessage = `Mã OTP đã hết hạn`;
        }
      }
  
      return res.status(400).json({ message: errorMessage });
    }
    const result = await Book.aggregate([
      {
        $match: {
          email: email
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

    return res.json(result)
  });

  static verifyEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new Error("Không có email");
   const otp = generateOtp()
   
    const html = `
    <p>Xin chào ${email},</p>
    <p>Dưới đây là mã OTP của bạn để tra cứu thông tin vé</p>
    <h2 style="background-color: #f4f4f4; padding: 10px; display:inline">${otp}</h2>
    <p>Nếu không phải là bạn vui lòng hiên hệ với chúng tôi</p>
    <p>Trân trọng,</p>
    <p>Đội ngũ hỗ trợ của chúng tôi</p>
`;
    const data = {
      to: email,
      subject: "Xác minh tra cứu vé",
      html: html,
    };
    try {
      await sendEmail(data);
      return res.json({
        message: "Email chứa mã OTP đã được gửi đến địa chỉ email của bạn.",
      });
    } catch (error) {
      throw new Error("Đã xảy ra lỗi khi gửi email.");
    }
  });

  static testQr = asyncHandler(async (req, res)  => {
    let img = await QRCode.toDataURL('https://cinema429.vercel.app/tracuu/ceb07c3c-bbdb-418e-8b6a-28ba81e3bb25');
    const emailData = {
      to: 'nguyenanh1997dz@gmail.com',
      subject: 'Your QR Code',
      text: 'Please find the QR code below.',
      html: `
        <p>Please find the QR code below:</p>
        <img src="${img}" alt="QR Code"/>
      `
    };

  
    await sendEmail(emailData);


    return res.send("oke")
  })
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
