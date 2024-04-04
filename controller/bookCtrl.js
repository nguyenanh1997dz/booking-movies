const asyncHandler = require("express-async-handler");
const Book = require("../model/bookModel");
const User = require("../model/userModel");
const Interest = require("../model/interestModel");
const moment = require("moment");
const paymentMethodsAray = ["Tiền mặt", "Thẻ"];
const sendEmail = require("../utils/sendMail");
class BookController {
  static createBook = asyncHandler(async (req, res) => {
    const { paymentMethod ,email } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (!paymentMethodsAray.includes(paymentMethod)) {
        return res.status(400).json({
          message: "Phương thức thanh toán không hợp lệ",
        });
      }
      const newBook = new Book(req.body);
      const interest = await Interest.findById(newBook.interest);
      if (interest.status !== 'Chưa bắt đầu') {
        return res.status(403).json({
            message: "Đặt vé thất bại",
            data: 'Suất chiếu không tồn tại hoặc đã hết thời gian đặt vé ',
          });
      }
      const duplicateSeats = newBook.seats.filter((seat) =>
        interest.bookedSeats.includes(seat)
      );
      if (duplicateSeats.length > 0) {
        return res.status(403).json({
          message: "Đặt vé thất bại",
          data: `Ghế ${duplicateSeats.join(", ")} đã có người đặt`,
        });
      }
      if (paymentMethod === 'Tiền mặt') {
        newBook.payment.method = paymentMethod
      }
      interest.bookedSeats.push(...newBook.seats);

      await newBook.save();
      await interest.save();
      if (user) {
        user.bookings.push(newBook._id);
        await user.save();
       }
      const html = `
      <div style="width: 80%;  max-width: 400px;   margin: 0 auto;  padding: 20px;  border: 1px solid #ccc; margin-left: 40px;">
      <nav style=" display: flex; padding-bottom: 20px;border-bottom: 2px dashed #ccc;"> <p style=" color: aliceblue;background-color: red;width: 36px; margin-right: 5px; text-align: center;font-size: 10px;padding: 6px 0 0 0;font-weight: bold;  ">C18 </p><p style=" font-weight: 700; color: black;font-size: 20px;">MAI</p> </nav>
      <div style="display: flex; padding: 10px 0 10px 0;justify-content: space-between; margin-right: 150px;">
          <ul style=" list-style-type: none; justify-content: space-between; color: #999999;">
              <li>Thời gian</li>
              <li style="color: black; font-weight: 700;">20:00~00:31</li>
          </ul>
          <ul style=" justify-content: space-between; color: #999999;">
              <li>Ngày chiếu</li>
              <li style="color: black; font-weight: 700;">11/3/2024</li>
          </ul>
      </div>
      <div style="text-decoration: none; list-style-type: none;">
          <p>Rạp</p>
          <h1>Galaxy Trường chinh</h1>
          <p>Tầng 3, CoopMart TTTM Thắng lợi - Số 2 Trường chinh, Tây thạnh, Tân phú, Thành phố HCM</p>
      </div>
      <div style="padding: 0 0 10px 0; border-bottom: 2px dashed #ccc;   ">
          <div style="display: flex; padding: 10px 0 10px 0; justify-content: space-between; margin-right: 150px;">
              <ul style=" list-style-type: none; justify-content: space-between; color: #999999;">
                  <li>Phường Chiếu</li>
                  <li style="color: black; font-weight: 700;">Rạp 2</li>
              </ul>
              <ul style="list-style-type: none; justify-content: space-between; color: #999999;">
                  <li>Định dạng</li>
                  <li style="color: black; font-weight: 700;">Phụ đề</li>
              </ul>
          </div>
      </div>
      <div style="padding: 10px 0 0 0;">
          <p>Ghế</p>
          <div style=" display: flex;  justify-content: space-between;">
              <ul>
                  <li style="color: black; font-weight: 700;">G3,G4</li>
              </ul>
              <ul>
                  <li>160,000đ</li>
              </ul>
          </div>
      </div>
      <div style="padding: 10px 0 0 0; border-bottom: 2px dashed #ccc;">
          <p>Bắp, nước</p>
          <div style="display: flex;justify-content: space-between;">
              <ul>
                  <li style="color: black; font-weight: 700;">G3,G4</li>
              </ul>
              <ul>
                  <li>109,000đ</li>
              </ul>
              
          </div>
          <div style="display: flex;justify-content: space-between;">
              <ul>
                  <li style="color: black; font-weight: 700;">G3,G4</li>
              </ul>
              <ul>
                  <li>109,000đ</li>
              </ul>
              
          </div>
      </div>
      <div style="padding: 10px 0 0 0;">
          <div style="display: flex;justify-content: space-between;">
              <ul>
                  <li style="color: black; font-weight: 700;">Tạm tính</li>
              </ul>
              <ul>
                  <li>378,000đ</li>
              </ul>
          </div>
      </div>
  </div>
    `;
    const data = {
      to: email,
      subject: "Vé xem phim",
      html: html,
  };
      await sendEmail(data);
      return res.status(200).json({
        message: "Đặt vé thành công",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi trong quá trình đặt vé " + error.message,
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
}
module.exports = BookController;
