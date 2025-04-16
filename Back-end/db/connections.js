const mongoose=require("mongoose")
require("dotenv").config()


const connection=mongoose.connect(process.env.mongodb)
.then(()=>console.log("connected"))
.catch((error)=>console.log(error))
module.exports=connection