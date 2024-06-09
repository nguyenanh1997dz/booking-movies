const express = require("express");
const ContentController = require("../controller/contentCtrl");

const router = express.Router();
router.get("/", ContentController.getAllContent)
router.get("/:blogId", ContentController.getContentByBlog)
router.post("/", ContentController.createContent)
router.delete("/:id", ContentController.deleteContent)
router.put("/:id", ContentController.updateContent)
router.post('/:id/increase-hot', ContentController.increaseHot);
module.exports = router;