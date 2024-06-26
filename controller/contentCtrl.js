const asyncHandler = require("express-async-handler");
const Content = require("../model/contentModel")

class ContentController {
    static createContent = asyncHandler(async (req, res) => {
        try {
            const newContent = await Content.create(req.body)
            return res.status(200).json({
                message: "Tạo bài viết thành công",
                data: newContent
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình tạo bài viết " + error.message
            })
        }
    })
    static getAllContent = asyncHandler(async (req, res) => {
        try {
            const contents = await Content.find()
            return res.status(200).json({
                message: "Thành công",
                data: contents
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình lấy dữ liệu thể loại phim " + error.message
            })
        }
    })
    static getContentById = asyncHandler(async (req, res) => {
        const { id } = req.params
        try {
            const genre = await Content.findById(id).exec();
            if (!genre) {
                return res.status(404).json({
                    message: "Không tìm thấy thể loại phim"
                });
            }
            return res.status(200).json({
                message: "Thành công",
                data: genre
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình lấy dữ liệu thể loại phim " + error.message
            });
        }
    })
    static deleteContent = asyncHandler(async (req, res) => {
        try {
            const contentId = req.params.id



            await Movie.updateMany({ content: contentId }, { $pull: { content: contentId } })
            await Status.findByIdAndDelete(contentId)
            // await branch.save()

            return res.status(200).json({
                message: "Xóa thể loại thành công",
            });

        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình xóa thể loại " + error.message
            })
        }
    })

    static updateContent = asyncHandler(async (req, res) => {
        const { id } = req.params
        try {
            const updateContent = await Content.findOneAndUpdate({ _id: id }, req.body, { new: true })
            console.log(updateContent);
            return res.status(200).json({
                message: "Thành công"
            })
        } catch (error) {
            return res.status(403).json({
                message: "Có lỗi sửa phim"
            })
        }
    })

    static getContentByBlog = asyncHandler(async (req, res) => {
        const { blogId } = req.params;
        try {
            const contents = await Content.find({ blog: blogId }).exec(); // Assuming 'blog' is a field in your content model
            if (!contents.length) {
                return res.status(404).json({
                    message: "Không tìm thấy bài viết cho blog này",
                });
            }
            return res.status(200).json({
                message: "Thành công",
                data: contents,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình lấy bài viết cho blog " + error.message,
            });
        }
    });

    static increaseHot = asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            // Tìm kiếm và cập nhật bài viết
            const updatedContent = await Content.findByIdAndUpdate(
                id,
                { $inc: { hot: 1 } }, // Tăng giá trị 'hot' lên 1
                { new: true } // Trả về bản ghi đã được cập nhật
            );

            if (!updatedContent) {
                return res.status(404).json({
                    message: "Không tìm thấy bài viết"
                });
            }

            return res.status(200).json({
                message: "Tăng giá trị 'hot' thành công",
                data: updatedContent
            });
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình tăng giá trị 'hot' " + error.message
            });
        }
    });
}
module.exports = ContentController;