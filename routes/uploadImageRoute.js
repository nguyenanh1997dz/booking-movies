const express = require("express");
const UploadImageController = require("../controller/uploadImgCtrl");
const { uploadPhoto,imgResize } = require("../middleware/upLoadImage");

const router = express.Router();
router.post("/",uploadPhoto.single("avatar"),imgResize,UploadImageController.upLoadImage)
router.delete("/:id",UploadImageController.deleteImage)
module.exports = router;