
// const ErrorHandler = require("../utils/ErrorHandeler")
const ApiFeatures = require("../utils/apiFeatures");
const createError = require('http-errors')
const catchAsyncErrors=require('../middlewares/catchAsynError')
const User=require('../models/userModel')
const sendEmail = require("../utils/sendEmail");
const {mongoose}=require('mongoose');
const sendToken = require("../utils/jwtToken");


// user register

exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password}=req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
          public_id: "thih is simple",
          url: "profile",
        },
      });

      sendToken(user,201,res) // import from jwttoken
})

// user login

exports.loginUser=catchAsyncErrors(async(req,res,next)=>{

    const {email,password}=req.body;
    // checking if user has email and password
    if(!email || !password) throw createError(401,'email or password not found')

    const user = await User.findOne({ email }).select("+password");

    if (!user) throw createError(401, 'user not found')
    
      const isPasswordMatched = await user.comparePassword(password);
    
      if (!isPasswordMatched) throw createError(401, 'user not found')

        sendToken(user,200,res)   // import from jwttoken
    });

    // logout controller

    exports.logOutUser=catchAsyncErrors(async(req,res,next)=>{
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
    
      res.status(200).json({
        success: true,
        message: "Logged Out",
      });
    })

    // Forgot Password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) throw createError(401, 'user not found')

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(createError(error.message, 500));
  }
});


// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(createError("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(createError("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
   user
  });
});

// get all users -- admin
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});


// Get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
     createError(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) throw createError(`User does not exist with Id: ${req.params.id}`)
    
  

  
  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});



