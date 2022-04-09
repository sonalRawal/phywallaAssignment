const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const voteSchema = new mongoose.Schema({
    userId :{type : ObjectId,ref:'user',require:true},
    pollId : {type : ObjectId,ref:'poll',require:true},
    answer : {type :String ,require:true}
}, { timestamps: true })

module.exports = mongoose.model('vote', voteSchema)