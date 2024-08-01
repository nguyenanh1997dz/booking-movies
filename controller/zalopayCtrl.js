const asyncHandler = require("express-async-handler");
const axios = require('axios');
const CryptoJS = require('crypto-js'); 

const moment = require('moment'); 
const config = {
    app_id: '2553',
    key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
  };

class ZaloPayController {
  static createPayment = asyncHandler(async (req, res) => {
    const {orderId,email,amount} = req.query
    const embed_data = {
    redirecturl: 'http://localhost:5000/ping',
  };
  const items = [];
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format('YYMMDD')}_${transID}`, 
    app_user: email,
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: amount,
    callback_url: 'https://f15a-2405-4802-91be-11d0-4166-ca74-8128-981c.ngrok-free.app/api/v1/zalopay/callback',
    description: `Thanh toán cho đơn hàng #${orderId}`,
    bank_code: '',
  };

  const data =
    config.app_id +
    '|' +
    order.app_trans_id +
    '|' +
    order.app_user +
    '|' +
    order.amount +
    '|' +
    order.app_time +
    '|' +
    order.embed_data +
    '|' +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, { params: order });

    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error);
  }

  });
  static callback = asyncHandler(async (req, res) => {
    let result = {};
    console.log(req.body);
    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;
      console.log(dataStr,reqMac);
      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      console.log('mac =', mac);
  

      if (reqMac !== mac) {

        result.return_code = -1;
        result.return_message = 'mac not equal';
      } else {
        const result = await axios.post(config.endpoint, null, { params: order });

        result.return_code = 1;
        result.return_message = 'success';
      }
    } catch (ex) {
      console.log('lỗi:::' + ex.message);
      result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.return_message = ex.message;
    }
  
    // thông báo kết quả cho ZaloPay server
    res.json(result);
  });
  

}



module.exports = ZaloPayController;
