import express, { urlencoded } from "express"
import { config } from "dotenv"
import productRouter from "./routes/product.js"
import userRouter from "./routes/user.js"
import { db_connect } from "./config/dbConnect.js"
import { errorHandler } from "./utils/error.js"
import cookieParser from "cookie-parser"
import orderRouter from "./routes/order.js"
import paymentRouter from "./routes/payment.js"

// HANDLING UNCAUGHT ERROR FROM MONGO SERVER
// above the codes coz not work if defined after undefined modules
    process.on("uncaughtException" ,(err)=>{
    console.log(`Error : ${err}`);
    console.log("Shutting down the server due to uncaught error")
    
    process.exit(1)
    })



// connecting config and db
config({
    path:"./config/config.env"
})
db_connect();

const app = express()

// using middlewares
app.use(express.json())
app.use(urlencoded({extended:true}))
app.use(cookieParser())


// routes middlewares
app.use("/api/v1" , productRouter)
app.use("/api/v1" , userRouter)
app.use("/api/v1" , orderRouter)
app.use("/api/v1" , paymentRouter)


const server = app.listen(process.env.PORT , ()=>{
   console.log(`app is running on port ${process.env.PORT} `)
})

// err midddleware
app.use(errorHandler)



// HANDLING UNHANDLED REJ FROM MONGO SERVER
process.on("unhandledRejection" ,(err)=>{
console.log(`Error : ${err}`);
console.log("Shutting down the server due to unhandled rejection issue")

server.close()
process.exit(1)
// 1 = success
})