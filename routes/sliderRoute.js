const express = require("express");
const { authMiddleware } = require("../middleware/authMiddlewere");
const SliderController = require("../controller/sliderCtrl");
const router = express.Router();
const { uploadPhoto, imgResize } = require("../middleware/upLoadImage");

router.get("/", SliderController.getAllSlider)
router.post("/", SliderController.createSlider)
router.delete("/:id", SliderController.deleteSlider)
router.put("/:id", SliderController.updateSlider)
module.exports = router;