const nodemailer = require("nodemailer");

const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Sử dụng service của Gmail
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.PASS_EMAIL,
    },
  });

  const sendOptions = {
    from: '"426 👻" <no-reply@gmail.com>',
    to: data.to,
    subject: data.subject,
    attachDataUrls: true,
    text: data.text,
    html: data.html,
  };

  try {
    const info = await transporter.sendMail(sendOptions);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

module.exports = sendEmail;
