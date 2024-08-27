const express = require("express");
const BlogController = require("../controller/blogCtrl");
const { authMiddleware, isAdmin} = require("../middleware/authMiddlewere");
const router = express.Router();

router.get('/', BlogController.getAllBlog)
router.post('/',authMiddleware,isAdmin, BlogController.createBlog)
router.delete("/:id",authMiddleware,isAdmin, BlogController.deleteBlog)
router.put("/:id",authMiddleware,isAdmin, BlogController.updateBlog)
module.exports = router;