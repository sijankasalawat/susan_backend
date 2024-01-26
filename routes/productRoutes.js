const router = require('express').Router();
const { Router } = require('express');
const productController = require('../controller/productController')
const authGuard = require('../middleware/auth')
router.post('/createProduct',authGuard,productController.createProduct);
router.get('/getProduct',productController.getProduct);
router.get('/getProductByUserId/:userId',authGuard,productController.getProductsByUserId);
router.delete('/deleteProduct/:productId', authGuard, productController.deleteProduct);
module.exports=router;
