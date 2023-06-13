const express=require('express')
const router=express.Router()
const { isAuthenticatedUser,authorizeRole } = require('../middlewares/auth');
const { newOrder, getSingleOrder, myOrders } = require('../controllers/orderController');


// create new order
router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/logged").get(isAuthenticatedUser, myOrders);

module.exports=router;