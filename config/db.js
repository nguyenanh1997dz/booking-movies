const mongoose = require("mongoose");
const URL = process.env.PORTMONGODB_URL
mongoose
  .connect(URL)
  .then(() => {
    console.log("Kết nối mongodb thành công...");
  })
  .catch((err) => {
    console.error(`Lỗi kết nối MongoDB: error: ${err}`);
  });
module.exports = mongoose.connection;