const express=require("express")
const {userRouter}=require('./controllers/userRoutes')
const ErrorMiddleware=require('./middleware/error')
const app=express()


app.use(express.json())



app.use("/user",userRouter)



app.use(ErrorMiddleware)








module.exports = { app };