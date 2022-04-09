const moment = require('moment')
const validate = require("../validator/validate")
const productModel = require("../model/productModel")
const reviewModel = require('../model/reviewModel')


const createReview = async function (req, res) {
    try {
        const requestBody = req.body;
        const productId = req.params.productId
        const product = await productModel.findOne({ _id: productId, isDeleted: false, deletedAt: null });
        
        if (!validate.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid parameters!!. Please provide review details' })
            return
        }
        if(!validate.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: `${productId} is an invalid product id` })
        }
        if (!product) {
            res.status(400).send({ status: false, message: `productId does not exists` })
            return
        }
        const { reviewedBy, review, rating ,reviewedAt } = requestBody;
        if (!validate.isValidObjectId(productId)) {
            res.status(400).send({ status: false, message: ' please provide valid productId ' })
            return
        }

        if (!validate.isValid(rating)) {
            res.status(400).send({ status: false, message: ' Please provide a valid rating' })
            return
        }
          
        if (!validate.isValid(review)) {
            res.status(400).send({ status: false, message: ' Please provide a review' })
            return
        }
        if(!validate.isValid(reviewedAt)) {
            return res.status(400).send({ status: false, message: `Review date is required`})
        }

        const newReview = await reviewModel.create( {
            productId: productId,
            reviewedBy: reviewedBy ? reviewedBy : "Guest",
            reviewedAt: moment(reviewedAt).toISOString(),
            rating: rating,
            review: review

        })

        product.reviews = product.reviews + 1
        await product.save()

        const data = product.toObject()
        data['reviewsData'] = newReview
        res.status(201).send({ status: true, message: 'review added successfully for this productId', data: data })

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message });
    }
}


const deleteReview = async function (req, res) {
    try {
        const productId = req.params.productId
        const reviewId = req.params.reviewId

        if (!(validate.isValid(productId) && validate.isValid(reviewId))) {
            return res.status(400).send({ status: false, msg: "params Id is not valid" })
        }
        const product = await productModel.findOne({ _id: productId, isDeleted: false})

        if(!product) return res.status(404).send({ status: false, message: 'product not found'})

        const review = await reviewModel.findOne({ _id: reviewId, productId: productId })

        if (!review) {
            res.status(404).send({ status: false, message: ` review not found` })
            return
        }
        let deleteReview = await reviewModel.findOneAndUpdate({ _id: reviewId, productId: productId, isDeleted: false, deletedAt: null },
            { isDeleted: true, deletedAt: new Date() }, { new: true })
            
        if(!deleteReview) {
            res.status(404).send({ status: false, msg: "review is alredy deleted" })
            return
        }
        product.reviews = product.reviews === 0 ? 0 : product.reviews - 1
        await product.save()

        res.status(200).send({ status: true, msg: "Review has been deleted successfully" })
        

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
};



module.exports = { createReview, deleteReview }