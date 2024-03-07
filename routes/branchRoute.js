const express = require("express");
const BranchController = require("../controller/branchCtrl");
const router = express.Router();

router.get('/',BranchController.getAllBranch )
router.post('/',BranchController.createBranch)
module.exports = router;