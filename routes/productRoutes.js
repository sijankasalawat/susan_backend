const router = require('express').Router();
const productController = require('../controller/productController')
const authGuard = require('../middleware/auth')
router.post('/createProduct',authGuard,productController.createProduct);
module.exports=router;