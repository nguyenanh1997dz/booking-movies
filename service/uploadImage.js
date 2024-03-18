

const {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
} = require("../utils/cloundiary");
const fs = require("fs");
class UploadImageService {
    static upLoadImage = async (req, res,folder) => {
        try {
            const file = req.file;
            const result = await cloudinaryUploadImg(file.path,folder);
            const newImg = {
                url: result.url,
                public_id: result.public_id
            };
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.error('Có lỗi xóa file:', err);
                }
            });
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
            const result = await cloudinaryDeleteImg(publicId);
        } catch (error) {
            console.log(error);
            throw new Error("Có lỗi trong quá trình xóa ảnh trên Cloudinary");
        }
    }
}
module.exports = UploadImageService;