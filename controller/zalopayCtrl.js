const asyncHandler = require("express-async-handler");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const qs = require("qs");
const moment = require("moment");


const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};
const formatTransID = (transID) => transID.split('_')[1];
class ZaloPayController {
  static createPayment = asyncHandler(async (req, res) => {
    const { orderId, email, amount } = req.query;    

    const embed_data = {
      //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
      redirecturl:
        `${process.env.BASE_SERVER_URL}/api/v1/zalopay/redirect-from-zalopay`,
    };  
    const items = [];
    
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${orderId}`,
      app_user: "",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: +amount,
      callback_url: `${process.env.BASE_SERVER_URL}/api/v1/zalopay/callback`,
      description: `Thanh toán cho đơn hàng${orderId}`,
      bank_code: "",
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
      const result = await axios.post(config.endpoint, null, { params: order });      
      return res.status(200).json({url: result.data.order_url,qr_code: result.data.qr_code});
    } catch (error) {
      console.log(error);
    }
  });
  static callback = asyncHandler(async (req, res) => {
    let result = {};
    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;
      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      if (reqMac !== mac) {
        result.return_code = -1;
        result.return_message = "mac not equal";
      } else {
        const orderJSON = JSON.parse(dataStr);
        const orderId = formatTransID(orderJSON?.app_trans_id)
        const url = `${process.env.BASE_SERVER_URL}/api/v1/book/vnpay?bookId=${orderId}&method=ZALOPAY`;
        await axios.post(url);
        result.return_code = 1;
        result.return_message = "success";
      }
    } catch (ex) {
      console.log("lỗi:::" + ex.message);
      result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
  });
  static check_status_order = asyncHandler(async (req, res) => {
    const { app_trans_id } = req.body;
    let postData = {
      app_id: config.app_id,
      app_trans_id, // Input your app_trans_id
    };
    let data =
      postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    let postConfig = {
      method: "post",
      url: "https://sb-openapi.zalopay.vn/v2/query",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify(postData),
    };

    try {
      const result = await axios(postConfig);
      console.log(result.data);
      return res.status(200).json(result.data);
      /**
     * kết quả mẫu
      {
        "return_code": 1, // 1 : Thành công, 2 : Thất bại, 3 : Đơn hàng chưa thanh toán hoặc giao dịch đang xử lý
        "return_message": "",
        "sub_return_code": 1,
        "sub_return_message": "",
        "is_processing": false,
        "amount": 50000,
        "zp_trans_id": 240331000000175,
        "server_time": 1711857138483,
        "discount_amount": 0
      }
    */
    } catch (error) {
      console.log("lỗi");
      console.log(error);
    }
  });
  static redirect_from_zalopay = asyncHandler(async (req, res) => {
    let data = req.query;
    let checksumData =
      data.appid +
      "|" +
      data.apptransid +
      "|" +
      data.pmcid +
      "|" +
      data.bankcode +
      "|" +
      data.amount +
      "|" +
      data.discountamount +
      "|" +
      data.status;
    let checksum = CryptoJS.HmacSHA256(checksumData, config.key2).toString();
    const orderId = formatTransID(data.apptransid)

    if (checksum != data.checksum) {
      const url = `${process.env.BASE_CLIENT_URL}`
      return res.redirect(url);
    } else {
      if (data.status === '1') {
        const url = `${process.env.BASE_CLIENT_URL}/thankyou/${orderId}`
        return  res.redirect(url);
      }else{
        const url = `${process.env.BASE_SERVER_URL}/api/v1/book/cancel?bookId=${orderId}`;
        const response = await axios.post(url);
        return res.redirect(response.data.url)
      }

    }
  });
}

module.exports = ZaloPayController;
