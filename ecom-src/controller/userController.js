const bcrypt = require('bcrypt');
const userModel = require("../model/userModel")
const { isValid, isValidRequestBody, validateEmail,isValidObjectId,validatePhone,validString} = require("../validator/validate")
const encrypt = require('../Encryption/Encrypt');
const jwt = require("jsonwebtoken")


const createUser = async function (req, res) {

    try {
        const requestBody = req.body;
        const { fname, lname, phone, email, password, address } = requestBody
        
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide user details' })
            return
        }

        if (!isValid(fname)) {
            res.status(400).send({ status: false, message: 'fname is required' })
            return
        }

        if (!isValid(lname)) {
            res.status(400).send({ status: false, message: `lname is required` })
            return
        }

        if (!isValid(phone)) {
            res.status(400).send({ status: false, message: `phone no. is required` })
            return
        }

        if (!validatePhone(phone)) {
            res.status(400).send({ status: false, message: `phone should be a valid number` });
            return;
        }
        const isPhoneNumberAlreadyUsed = await userModel.findOne({ phone: phone });
        if (isPhoneNumberAlreadyUsed) {
            res.status(400).send({ status: false, message: `${phone} mobile number is already registered`, });
            return;
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
        }
        if (!validateEmail(email)) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }
        const isEmailAlreadyUsed = await userModel.findOne({ email }); // {email: email} object shorthand property 
        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email} email address is already registered` })
            return
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, message: `Password is required` })
            return
        }
        if (!(password.trim().length > 7 && password.trim().length < 16)) {
            res.status(400).send({ status: false, message: `${password} invalid` })
            return
        }

        const hashPassword = await encrypt.hashPassword(password)
        requestBody.password = hashPassword;
        if (!address) {
            res.status(400).send({ status: false, message: `address is required` })
            return
        }

        requestBody.address = JSON.parse(address)

        if (!requestBody.address.shipping) {
            res.status(400).send({ status: false, message: `shipping address is required` })
            return
        }

        if (!requestBody.address.billing) {
            res.status(400).send({ status: false, message: `billing address is required` })
            return
        }

        if (!validString(requestBody.address.shipping.street)) return res.status(400).send({ status: false, message: `street of shipping address is required` })

        if (!validString(requestBody.address.shipping.city)) return res.status(400).send({ status: false, message: `city of shipping address is required` })

        if (!(typeof requestBody.address.shipping.pincode === 'number')) return res.status(400).send({ status: false, message: `pincode of shipping address is required` })

        if (!validString(requestBody.address.billing.street)) return res.status(400).send({ status: false, message: `street of billing address is required` })

        if (!validString(requestBody.address.billing.city)) return res.status(400).send({ status: false, message: `city of billing address is required` })

        if (!(typeof requestBody.address.billing.pincode === 'number')) return res.status(400).send({ status: false, message: `pincode of billing address is required` })

        requestBody['profileImage'] = req.urlimage

        
            const userData = await userModel.create(requestBody)
            res.status(201).send({ status: true, msg: "successfully created", data: userData })
        
    } catch (err) {

        res.status(500).send({ status: false, msg: err.message })
    }

}
// LOGIN USER 
const loginUser = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
            return
        }
        const phone = requestBody.phone ;

        if (!isValid(phone)) {
            res.status(400).send({ status: false, message: `phone no. is required` })
            return
        }

        if (!validatePhone(phone)) {
            res.status(400).send({ status: false, message: `Invalid login credentials` });
            return;
        }
        const user = await userModel.findOne({ phone: phone });
        if (user) {
            res.status(400).send({ status: false, message: `${phone} mobile number is already registered`, });
            return;
        }
        
        
        let userId = user._id
        let payload = { userId: userId }
        let token = await jwt.sign(payload,

            '22nd-Dec-Project-Product', { expiresIn: '10hr' })

        res.header('Authorization', token);
        res.status(200).send({ status: true, message: `User logged in successfully`, data: { userId, token } });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
// get user profile by user id
const getUserProfileById = async function (req, res) {
    try {
        const userId = req.params.userId
        if (!isValidObjectId(userId)) {
            return res.status(404).send({ status: false, message: "userId is not valid" })
        }
        let userDetail = await userModel.findOne({ _id: req.params.userId })

        if (!userDetail) {
            return res.status(404).send({ status: false, message: "User not found" })
        }

        res.status(200).send({ status: true, message: "User profile Details", data: userDetail })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { createUser, loginUser, getUserProfileById }