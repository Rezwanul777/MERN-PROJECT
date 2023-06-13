const express=require('express');
const { createProduct, getAllProduct, updateProduct, deleteProduct, getsingleProduct, createProductReview, getAdminProducts } = require('../controllers/productController');
const { isAuthenticatedUser,authorizeRole } = require('../middlewares/auth');



const router=express.Router()

router.get("/", (req, res) => {
    res.status(200).json({ status: "Successfull" });
  });

  // crearte product route
  router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRole("admin"),createProduct);

  // get all product
  router.route('/products').get(getAllProduct)
  router.route("/admin/products").get(isAuthenticatedUser, authorizeRole("admin"), getAdminProducts);

  // single product
  router.route("/single-product/:id").get(getsingleProduct)

  // upadate product 
  router.route('/update-product/:id').put(isAuthenticatedUser,authorizeRole("admin"),updateProduct)

  // delete product
  router.route('/delete-product/:id').delete(isAuthenticatedUser,authorizeRole("admin"),
  deleteProduct)
  
// review oroduct
  router.route("/review").put(isAuthenticatedUser, createProductReview);

module.exports=router;