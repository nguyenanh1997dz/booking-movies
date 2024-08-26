const generateEmailHtml = require("../templates/ticket");
const sendEmail = require("../utils/sendMail");



class sendMailService {

    static ticket = async (ticket) => {
     const html =     generateEmailHtml(ticket)
     const data = {
        to: "nguyenanh1997dz@gmail.com",
        subject: "Xác minh tra cứu vé",
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