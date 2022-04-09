const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({

    title:{type:String, required: true, unique : true,trim:true},

    description: {type:String, required: true,trim:true},

    price: {type:Number, required: true}, 

    isFreeShipping: {type:Boolean, default: false},

    productImage: {type:String, required: true},  // s3 link

    availableSizes: {type:[String] }, 

    installments: {type:Number},

    reviews : {type:Number,default:null},

    isDeleted : {type:Boolean ,default:true },

    deletedAt : {type : Date,default:null}


},{ timestamps: true })


module.exports = mongoose.model('products', productSchema)