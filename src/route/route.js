const express = require("express");
const router = express.Router()
const collegeController = require('../Controllers/collegeController')
const internController = require('../Controllers/internController')


router.post("/functionup/colleges",collegeController.createCollege )// create college
router.post("/functionup/interns", internController.createIntern)//create intern 
router.get("/functionup/collegeDetails", collegeController.getCollegeDetails )// get college info with intern

module.exports = router