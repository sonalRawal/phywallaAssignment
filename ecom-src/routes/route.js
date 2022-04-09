const express = require("express");
const router = express.Router();
const userController= require('../controller/userController')
const productController= require('../controller/productController')
const cartController= require('../controller/cartController')
const orderController = require('../controller/orderController')
const reviewController= require('../controller/reviewController')
const usermid = require('../middleware/userMiddleware')


//user api 
 router.post("/register",usermid.urlOfProfileImage, userController.createUser)
 router.post('/login' ,  userController.loginUser);
 router.get('/user/:userId/profile' ,usermid.authToken, userController.getUserProfileById);

//product api
router.post("/products", usermid.urlOfProfileImage, productController.createProduct)
router.put('/products/:productId' , usermid.urlOfProfileImageForUpdate, productController.updateProduct);
router.get('/products', productController.getProduct)
router.delete('/products/:productId', productController.deleteProduct)

//cart api
router.post("/users/:userId/cart", usermid.authToken,cartController.createCart)
router.get('/users/:userId/cart', usermid.authToken , cartController.getCart)
router.put('/users/:userId/cart',usermid.authToken,cartController.updateCart)
router.delete('/users/:userId/cart',usermid.authToken,cartController.deleteCart)

//order api
router.post('/users/:userId/orders',usermid.authToken, orderController.createOrder);
router.put('/users/:userId/orders',usermid.authToken, orderController.updateOrder);

//review api
router.post("/products/:productId/review" , reviewController.createReview)
router.delete("/products/:productId/review/:reviewId",reviewController.deleteReview)


module.exports = router;