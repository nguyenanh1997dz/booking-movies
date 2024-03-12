const asyncHandler = require("express-async-handler");
const {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
  } = require("../utils/cloundiary");
  const fs = require("fs");
class UploadImageController {
    static upLoadImage = asyncHandler(async (req, res) => {
        try {
          const uploader = (path) => cloudinaryUploadImg(path);
          const file = req.file;
          const newpath = await uploader(file.path);
          const newImg = {
            "url": newpath.url,
            "public_id": newpath.public_id
          }
          fs.unlinkSync(file.path);
          res.json({
            message: "Tải ảnh lên thành công",
            data: newImg,
          });
        } catch (error) {
            console.log(error);
          res.status(401).json({
            message: "Có lỗi trong quá trình tải ảnh",
          });
        }
      });
    static deleteImage = asyncHandler(async (req, res) => {
        const { id } = req.params;
 
        try {
          const deleted = await cloudinaryDeleteImg(id);
          console.log(deleted);
          res.json({ message: "Xóa ảnh thành công" });
        } catch (error) {
          res.status(401).json({
            message: "Có lỗi trong xóa ảnh",
          });
        }
      });
}
module.exports = UploadImageController;