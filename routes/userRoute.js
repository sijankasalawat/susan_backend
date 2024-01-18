const router = require('express').Router();
const userController = require('../controller/userController')

router.post('/create',userController.createUser);
router.post('/login', userController.loginUser);
router.route("/forgot/password").post(userController.forgotPassword);
router.route("/password/reset/:token").put(userController.resetPassword);
module.exports=router;