const express = require("express");
const BlogController = require("../controller/blogCtrl");
const router = express.Router();

router.get('/', BlogController.getAllBlog)
router.post('/', BlogController.createBlog)
router.delete("/:id", BlogController.deleteBlog)
router.put("/:id", BlogController.updateBlog)
module.exports = router;