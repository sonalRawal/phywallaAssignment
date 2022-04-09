const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const pollSchema = new mongoose.Schema({
    title :{type:String,require:true},
    options :[{
        _id : false,
        text :{type:String,require:true}
    }],
    expireAt : {type:Date,require:true}

}, { timestamps: true })

module.exports = mongoose.model('poll', pollSchema)