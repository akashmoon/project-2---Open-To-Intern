const express = require("express")
const bodyParser = require("body-parser")
const route = require("./Route/route")
const { default: mongoose } = require("mongoose")
const app = express()


app.use(bodyParser.json())


mongoose.connect("mongodb+srv://akashmoon:akash_moon@cluster0.xvaineh.mongodb.net/project2_Open-To-Intern?retryWrites=true&w=majority",)

    .then(() => console.log("MongoDB is Connected."))
    .catch(err => console.log(err))

app.use('/', route)

app.listen(process.env.PORT || 3000, function () {
    console.log("Express is running on port " + (process.env.PORT || 3000))
})