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
   
