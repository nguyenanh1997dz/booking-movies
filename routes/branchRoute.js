const express = require("express");
const BranchController = require("../controller/branchCtrl");
const router = express.Router();

router.get('/', BranchController.getAllBranch)
router.post('/', BranchController.createBranch)
router.get('/find', BranchController.getBranchByName)
module.exports = router;