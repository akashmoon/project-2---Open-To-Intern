const { get } = require("mongoose")
const collegeModel = require("../Models/collegeModel")
const internModel = require("../Models/internModel")

// --------validation function declared------------
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}
const isValidRequestBody = function (request) {
    return (Object.keys(request).length > 0)
}
// ----------- regex validation -------------------------------
const nameRegex = /^[a-zA-Z\\s]{2,10}$/                 //     will not consider space between
const fullNameRegex = /^[a-zA-Z ]{2,100}$/               //     consider space between

const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/

// Create College
const createCollege = async function (req, res) {
    try {
        const collegeData = req.body
        console.log(req.params.college)
        const { name, fullName, logoLink } = collegeData

        //validation ---- for all above fields---------
        let invalid = " "
        if (!isValidRequestBody(collegeData)) return res.status(400).send({ status: false, message: "No input by user." })
        if (!isValid(name) || !nameRegex.test(name)) invalid = invalid + "name "

        if (!isValid(fullName) || !fullNameRegex.test(fullName)) invalid = invalid + "fullName,"

        if (!isValid(logoLink) || !urlRegex.test(logoLink)) invalid = invalid + "logoLink"

         // this is checking all req body fields valid or not by using or operator
        if ((!isValid(name) || !nameRegex.test(name)) || (!isValid(fullName) || !fullNameRegex.test(fullName)) || (!isValid(logoLink) || !urlRegex.test(logoLink))) { return res.status(400).send({ status: false, msg: `${invalid} is not valid or provided in above req body` }) }

      // -------- checking college----already in collection or not 
        const college = await collegeModel.findOne({ name })
        if (college) return res.status(400).send({ status: false, message: `${name} is not unique its already registered.` })
      //--------creating college documents-------------
        const newCollege = await collegeModel.create(collegeData)
        res.status(201).send({ status: true, message: "College created succesfully.", data: newCollege })

    }
    catch (err) {
        // internal server error
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}

// Get College Details
const getCollegeDetails = async function (req, res) {
    try {
        const userQuery = req.query  //req query
        //-------validation code ------------------------------------
        if (!isValidRequestBody(userQuery)) return res.status(400).send({ status: false, message: "No college name entered." })
        // if(!isValidRequestBody(userQuery)){
        //     const getCollegeName = await collegeModel.find()
        //     return res.status(200).send({msg:"list of all colleges",data:getCollegeName})
        // } 
        //------------------------------
        const collegeName = req.query.collegeName
        const getCollegeName = await collegeModel.findOne({ name: collegeName, isDeleted: false })

        if (!getCollegeName) return res.status(404).send({ status: false, message: "No colleges found with this name" })

        const getCollegeId = getCollegeName._id
        const Interns = await internModel.find({collegeId: getCollegeId, isDeleted: false }).select({ name: 1, email: 1, mobile: 1 })
        
        

        if (Interns.length === 0) return res.status(404).send({ status: false, message: `No Internship applications submitted at ${collegeName} till now.` })

        const allInterns = {
            name: getCollegeName.name,
            fullName: getCollegeName.fullName,
            logoLink: getCollegeName.logoLink,
            interns: Interns
        }
        res.status(200).send({ status: true, data: allInterns })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}

module.exports.createCollege = createCollege
module.exports.getCollegeDetails = getCollegeDetails
