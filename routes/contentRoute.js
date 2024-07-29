const express = require("express");
const ContentController = require("../controller/contentCtrl");
const { uploadPhoto, imgResize } = require("../middleware/upLoadImage");

const router = express.Router();
router.get("/", ContentController.getAllContent)
router.get("/:blogId/blog", ContentController.getContentByBlog)
router.get("/:id/content", ContentController.getContentById)
router.post("/", ContentController.createContent)
router.post("/img", uploadPhoto.single("image"), imgResize, ContentController.uploadImgContent)
router.delete("/:id", ContentController.deleteContent)
router.put("/:id", ContentController.updateContent)
router.post('/:id/increase-hot', ContentController.increaseHot);
router.get("/top/top-content", ContentController.getTopContent)
module.exports = router;