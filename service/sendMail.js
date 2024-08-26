const generateEmailHtml = require("../templates/ticket");
const sendEmail = require("../utils/sendMail");



class sendMailService {

    static ticket = async (ticket,qrCode) => {
     const html =     generateEmailHtml(ticket,qrCode)
     const data = {
        to: ticket.email,
        subject: `Xác nhận đặt vé ${ticket.interest.room.branch.name} thành công - Mã giao dịch 53230116379`,
        html: html,
      };
      try {
        await sendEmail(data);
        return true
      } catch (error) {
        return false;
      }
     
    }
}
module.exports = sendMailService;