const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const SliderController = require("../controller/sliderCtrl");
const router = express.Router();
const { uploadPhoto, imgResize } = require("../middleware/upLoadImage");

router.get("/", SliderController.getAllSlider)
router.post("/", SliderController.createSlider)
router.delete("/:id", SliderController.deleteSlider)
router.post("/img", uploadPhoto.single("image"), imgResize, SliderController.uploadImgSlider)
router.put("/:id", SliderController.updateSlider)
router.delete("/img/:id", SliderController.deleteImageslider)
module.exports = router;