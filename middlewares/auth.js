
const catchAsynError = require("./catchAsynError");
const createError = require('http-errors')
const User = require("../models/userModel");
const jwt =require("jsonwebtoken")

exports.isAuthenticatedUser=catchAsynError(async(req,res,next)=>{
    const {token}=req.cookies;
    if (!token) next (createError (401, 'Please login for access'))
    
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    
      req.user = await User.findById(decodedData.id);
    
      next();
})

exports.authorizeRole = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return (
            createError(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
            ) 
        );
      }
  
      next();
    };
  }