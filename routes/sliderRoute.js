const express = require("express");
const { authMiddleware ,isAdmin} = require("../middleware/authMiddlewere");
const SliderController = require("../controller/sliderCtrl");
const router = express.Router();
const { uploadPhoto, imgResize } = require("../middleware/upLoadImage");

router.get("/", SliderController.getAllSlider)
router.post("/",authMiddleware,isAdmin, SliderController.createSlider)
router.delete("/:id",authMiddleware,isAdmin, SliderController.deleteSlider)
router.post("/img", uploadPhoto.single("image"), imgResize, SliderController.uploadImgSlider)
router.put("/:id",authMiddleware,isAdmin, SliderController.updateSlider)
router.delete("/img/:id",authMiddleware,isAdmin, SliderController.deleteImageslider)
module.exports = router;