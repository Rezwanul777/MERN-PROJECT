const express = require("express");
const cookieParser=require("cookie-parser")
const app = express();
const errorMiddleware = require("./middlewares/error");
const errorResponse = require("./utils/ErrorHandeler");

// use middleware
app.use(express.json())
app.use(cookieParser())

// routes import

const product=require('./routes/productRoute');

const user=require('./routes/userRoute');

const order=require('./routes/orderRoute')

app.use('/api/v1',product)
app.use('/api/v1',user)
app.use('/api/v1',order)

//client error handeling

app.use((req,res,next)=>{
    
    next(createError(404,"user not found"))
})

// server error handling-- all error handeling in server side
// Middleware for Errors


app.use((err,req,res,next)=>{

    return errorResponse(res,{  // import from responseController
        statusCode:err.status,
        message:err.message
    })
})



module.exports = app;