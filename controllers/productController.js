const Product=require("../models/productModel")
const ErrorHandler = require("../utils/ErrorHandeler")
const ApiFeatures = require("../utils/apiFeatures");
const createError = require('http-errors')
const catchAsyncErrors=require('../middlewares/catchAsynError')
const {mongoose}=require('mongoose');


// CREATE CONTROLLER
exports.createProduct=catchAsyncErrors(async(req,res,next)=>{
   req.body.user = req.user.id
 const product=await Product.create(req.body)
   res.status(201).json({
    success:true,
    product
   }) 
     
    })


// GET ALL PRODuCT S CONTROLLER
exports.getAllProduct=catchAsyncErrors(async(req,res,next)=>{
  const resultPerPage = 4;
  const productsCount = await Product.countDocuments();

    // search funtion
const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage)

let products = await apiFeature.query;
 
 apiFeature.pagination(resultPerPage);

 res.status(200).json({
        success:true,
        products,
        productsCount,
       
    })
})

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// get single product

exports.getsingleProduct=catchAsyncErrors(async(req,res,next)=>{
 
        const product=await Product.findById(req.params.id)
        if(!product) throw createError(404, "product not found")

        res.status(200).json({
            success:true,
            product
        })
    
    })
    


// update product--- By Admin

exports.updateProduct=catchAsyncErrors(async(req,res)=>{
    
        let product=await Product.findById(req.params.id)
    if(!product){
       return res.status(500).json({
            success:false,
            message:"Product is not found"
        })
    }

    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        
    })
    res.status(200).json({
        success:true,
        message:"product updated successfully",
        product
    })
    })


// delete product--- By Admin

exports.deleteProduct=catchAsyncErrors(async(req,res)=>{
    
        const product=await Product.findByIdAndDelete(req.params.id)
        if (!product) {
            return res.status(500).json({
                success:false,
                message:"Product is not found"
            })
          }
        else{
            res.status(200).send({
                success: true,
                message: "Product Deleted successfully",
                product
              }); 
        }
  
    })
   
    // Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });
