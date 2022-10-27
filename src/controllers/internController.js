const collegeModel = require("../Models/collegeModel")
const internModel = require("../Models/internModel")

const nameRegex = /^[a-zA-Z ]{2,45}$/                                //  /^[a-zA-Z\\s]*$/   <--- will not consider space between
const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
const mobileRegex = /^[6-9]\d{9}$/                                 // /^[0-9]{10}$/  <--Only verify numbers
const fullNameRegex = /^[a-zA-Z ]{2,100}$/  

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidRequestBody = function (request) {
    return (Object.keys(request).length > 0)
}

// Create Intern
const createIntern = async function (req, res) {
    try {

        const internData = req.body
        const { name, email, mobile, collegeName } = internData
        
        // validation for intern feilds ---------
         let invalid = "  "
        if (!isValidRequestBody(internData)) return res.status(400).send({ status: false, message: "No input by intern user." })
        if (!isValid(name) || !nameRegex.test(name)) invalid = invalid + "name, "

        if (!isValid(email) || !emailRegex.test(email)) invalid = invalid + "email, "

        if (!isValid(mobile) || !mobileRegex.test(mobile)) invalid = invalid + "Mobile"
        if (!isValid(collegeName) || !nameRegex.test(collegeName)) invalid = invalid + "collegeName"

        if ((!isValid(name) || !nameRegex.test(name)) || (!isValid(email) || !emailRegex.test(email)) || (!isValid(mobile) || !mobileRegex.test(mobile))|| !isValid(collegeName) || !nameRegex.test(collegeName)) { return res.status(400).send({ status: false, msg: `${invalid} is not valid or provided in above req body` }) }

        //-----it is checking clg name is already present or not
        const getCollege = await collegeModel.findOne({ name: collegeName, isDeleted: false })
        if (!getCollege) return res.status(404).send({ status: false, message: "college not found." })

        //-----it is checking email is already present or not
        const usedEmail = await internModel.findOne({ email })
        if (usedEmail) return res.status(400).send({ status: false, message: "Email id already exists. Please use another email id." })

        //-----it is checking mobile is already present or not
        const usedMobile = await internModel.findOne({ mobile })
        if (usedMobile) return res.status(400).send({ status: false, message: "Mobile no already exists. Please use another mobile no.." })

        const collegeId = getCollege._id
        const newInternData = { name, email, mobile,collegeName, collegeId }

        

        const newIntern = await internModel.create(newInternData)
        res.status(201).send({ status: true, message: "Internship application successful.", data: newIntern })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}

module.exports.createIntern = createIntern
