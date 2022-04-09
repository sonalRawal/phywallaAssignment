const express = require("express");
const router = express.Router();


const userController= require('../controller/userCon')
const voteController= require('../controller/voteCon')
const pollController= require('../controller/pollCon')
const usermid = require('../middleware/userMiddleware')

//user api 
router.post("/register", userController.createUser)
router.post('/login',userController.loginUser);

//poll api
router.post('/createpoll',pollController.createpoll)

//vote api
router.post('/vote/:userId',usermid.authToken,voteController.createvote)


module.exports = router;