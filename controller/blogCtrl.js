const asyncHandler = require("express-async-handler");
const Blog = require("../model/blogModel");
class BlogController {
    static createBlog = asyncHandler(async (req, res) => {
        try {
            const newBlog = await Blog.create(req.body)
            return res.status(200).json({
                message: "Tạo Blog thành công",
                data: newBlog
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình tạo blog" + error.message
            })
        }
    })
    static getAllBlog = asyncHandler(async (req, res) => {
        try {
            const allBlog = await Blog.find()
            return res.status(200).json({
                message: "Thành công",
                data: allBlog
            })
        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi lấy blog " + error.message
            })
        }
    })
    // static getCinemaById = asyncHandler(async (req, res) => {
    //     const { id } = req.params
    //     try {
    //         const cinema = await Cinema.findById(id)
    //         return res.status(200).json({
    //             message: "Thành công",
    //             data: cinema
    //         })
    //     } catch (error) {
    //         return res.status(500).json({
    //             message: "Có lỗi lấy rạp " + error.message
    //         })
    //     }
    // })
    static deleteBlog = asyncHandler(async (req, res) => {
        try {
            const blogId = req.params.id



            await Blog.findByIdAndDelete(blogId)
            // await branch.save()

            return res.status(200).json({
                message: "Xóa Blog thành công",
            });

        } catch (error) {
            return res.status(500).json({
                message: "Có lỗi trong quá trình xóa blog " + error.message
            })
        }
    })

    static updateBlog = asyncHandler(async (req, res) => {
        const { id } = req.params
        try {
            const updateBlog = await Blog.findOneAndUpdate({ _id: id }, req.body, { new: true })
            console.log(updateBlog);
            return res.status(200).json({
                message: "Thành công"
            })
        } catch (error) {
            return res.status(403).json({
                message: "Có lỗi sửa phim"
            })
        }
    })
}
module.exports = BlogController