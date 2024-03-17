

const cloudinary = require("../node_modules/cloudinary")
const asyncHandler = require("express-async-handler");
const {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
} = require("../utils/cloundiary");
const fs = require("fs");
class UploadImageController {
    static upLoadImage = async (req, res) => {
        try {
            const file = req.file;
            const result = await cloudinary.uploader.upload(file.path);
            const newImg = {
                url: result.url,
                public_id: result.public_id
            };
            return newImg;
        } catch (error) {
            console.log(error);
            res.status(401).json({
                message: "Có lỗi trong quá trình tải ảnh",
            });
        }
    }
    static deleteImage = async (publicId) => {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            console.log(result)
        } catch (error) {
            console.log(error);
            throw new Error("Có lỗi trong quá trình xóa ảnh trên Cloudinary");
        }
    }
}
module.exports = UploadImageController;