const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const internSchema = mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim: true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    collegeId:{
        type:ObjectId,
        trim:true,
        ref: "College"
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
}, {timestamps:true}
)
 module.exports = mongoose.model("Intern",internSchema)