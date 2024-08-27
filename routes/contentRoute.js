const express = require("express");
const ContentController = require("../controller/contentCtrl");
const { uploadPhoto, imgResize } = require("../middleware/upLoadImage");
const { authMiddleware, isAdmin} = require("../middleware/authMiddlewere");
const router = express.Router();
router.get("/", ContentController.getAllContent)
router.get("/:blogId/blog", ContentController.getContentByBlog)
router.get("/:id/content", ContentController.getContentById)
router.post("/",authMiddleware,isAdmin, ContentController.createContent)
router.post("/img",authMiddleware,isAdmin, uploadPhoto.single("image"), imgResize, ContentController.uploadImgContent)
router.delete("/:id",authMiddleware,isAdmin, ContentController.deleteContent)
router.put("/:id",authMiddleware,isAdmin, ContentController.updateContent)
router.post('/:id/increase-hot',authMiddleware,isAdmin, ContentController.increaseHot);
router.get("/top/top-content",authMiddleware,isAdmin, ContentController.getTopContent)
module.exports = router;