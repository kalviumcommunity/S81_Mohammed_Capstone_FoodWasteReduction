const {app}=require("./app")

require("dotenv").config()

const connection=require('./db/connections')


app.get("/test",async(req,res)=>{
    console.log("It is running")
      

})
const port=process.env.PORT 

app.listen(port,async()=>{
    try {
        await connection
        console.log(`Server is Running on http://localhost:${port}`)
    } catch (error) {
        console.log(error,"Internal Server Error")
    }
})