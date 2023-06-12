const express=require('express');
const { createProduct, getAllProduct, updateProduct, deleteProduct, getsingleProduct } = require('../controllers/productController');
const { isAuthenticatedUser,authorizeRole } = require('../middlewares/auth');



const router=express.Router()

router.get("/", (req, res) => {
    res.status(200).json({ status: "Successfull" });
  });

  // crearte product route
  router.route("/product/new").post(isAuthenticatedUser,createProduct);

  // get all product
  router.route('/products').get(getAllProduct)

  // single product
  router.route("/single-product/:id").get(getsingleProduct)

  // upadate product 
  router.route('/update-product/:id').put(isAuthenticatedUser,authorizeRole("admin"),updateProduct)

  // delete product
  router.route('/delete-product/:id').delete(isAuthenticatedUser,authorizeRole("admin"),deleteProduct)

module.exports=router;