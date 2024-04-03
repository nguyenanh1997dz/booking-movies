const asyncHandler = require("express-async-handler");
const moment = require("moment");
var config = require("config");
var querystring = require("qs");
var crypto = require("crypto");
class VNPAYController {
  static createPayment = asyncHandler((req, res) => {
        try {
            process.env.TZ = "Asia/Ho_Chi_Minh";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let tmnCode = config.get("vnp_TmnCode");
    let secretKey = config.get("vnp_HashSecret");
    let vnpUrl = config.get("vnp_Url");
    let returnUrl = config.get("vnp_ReturnUrl");
    let orderId = moment(date).format("DDHHmmss");
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    console.log(amount,bankCode);
    let locale = req.body.language;
    if (locale === null || locale === undefined || locale === "") {
      locale = "vn";
    }
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toán mua vé xem phim:" + orderId;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }
    vnp_Params = sortObject(vnp_Params);
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    res.status(200).json({
      vnpUrl,
    });
        } catch (error) {
            res.status(500).json({
                message: "Có lỗi trong quá trình tạo thanh toán: " + error.message
            })
        }
  });
  static getPaymentInfo = asyncHandler((req, res) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    vnp_Params = sortObject(vnp_Params);
    let secretKey = config.get("vnp_HashSecret");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    if (secureHash === signed) {
        res.status(200).json({
            message: "Thông tin giao dịch",
            data: vnp_Params
        });
    } else {
        res.status(500).json({
            message:"Có lỗi gì đó liên quan vnpay"
        });
    }
  });
}

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
const errorResponseCode = {
  '00': "Giao dịch thành công" ,
  '07': "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)." ,
  '09': "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng." ,
  '10': "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần" ,
  '00': "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch." ,
  '00': "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa." ,
  '00': "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch." ,
  '00': "Giao dịch không thành công do: Khách hàng hủy giao dịch" ,
  '00': "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch." ,
  '00': "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày." ,
  '00': "Ngân hàng thanh toán đang bảo trì." ,
  '00': "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch" ,
}
module.exports = VNPAYController;
