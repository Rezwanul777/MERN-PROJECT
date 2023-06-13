const express=require('express');
const { registerUser,  loginUser, logOutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require('../controllers/userController');
const { isAuthenticatedUser,authorizeRole } = require('../middlewares/auth');


const router=express.Router()



// create user route
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/password/forgot').post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword);

router.route('/logout').get(logOutUser)

router.route("/user").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/user/update").put(isAuthenticatedUser, updateProfile);
router.route("/admin/users").get(isAuthenticatedUser,authorizeRole("admin"),getAllUser)
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRole("admin"),getSingleUser)
router.route("/admin/user/:id").put(isAuthenticatedUser,authorizeRole("admin"),updateUserRole)
router.route("/admin/user/:id").delete(isAuthenticatedUser,authorizeRole("admin"),deleteUser)

module.exports=router