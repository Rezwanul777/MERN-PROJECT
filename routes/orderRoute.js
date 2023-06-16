const express=require('express')
const router=express.Router()
const { isAuthenticatedUser,authorizeRole } = require('../middlewares/auth');
const { newOrder, getSingleOrder, myOrders, updateOrder, getAllOrders, deleteOrder } = require('../controllers/orderController');


//  order route
router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/logged").get(isAuthenticatedUser, myOrders);
router.route("/orders/admin").get(isAuthenticatedUser,authorizeRole("admin"),getAllOrders)
router.route("/admin/order/:id").put(isAuthenticatedUser,authorizeRole("admin"),updateOrder)
router.route("/admin/order/:id").delete(isAuthenticatedUser,authorizeRole("admin"),deleteOrder)

module.exports=router;