const pollModel = require("../model/pollModel");
const userModel = require("../model/userModel");
const voteModel = require("../model/voteModel")
const { isValidRequestBody,isValidObjectId} = require("../validator/validate")

const createvote = async function (req, res) {
    try{
        const requestBody = req.body;
        const {pollId,answer } = requestBody
        const userId = req.params.userId

        const voteCreateData = {}
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide details' })
            return
        }

        if (!isValidObjectId(pollId)) {
            res.status(400).send({ status: false, message: 'please provide valid pollId' })
            return
        }
        const poll = await pollModel.findOne({_id:pollId})
        if(!poll){
            res.status(400).send({ status: false, message: 'poll not exist' })
            return
        }

        voteCreateData[pollId] =  pollId;

        const user = await userModel.findOne({_id:userId})

        if(!user){
            res.status(400).send({ status: false, message: 'user not exist' })
            return
        }
        if (!isValidObjectId(userId)) {
            res.status(400).send({ status: false, message: 'please provide valid userId' })
            return
        }

        voteCreateData[userId] = userId;
        const voteByuser = await voteModel.findOne({userId:userId,pollId: pollId})

        if(voteByuser){
            res.status(400).send({ status: false, message: 'user alredy voted at this poll' })
            return
        }

        voteCreateData[answer] = answer;
        const data = await voteModel.create(voteCreateData)
       console.log(data)
        const result = await voteModel.aggregate([
            {
              $match: {
                pollId: pollId
              }
            },
            {
              $group: {
                _id: "$answer",
                count: {
                  $sum: 1
                }
              }
            }])
     res.status(201).send({status:true,msg:`new vote added and result is ${result}`})


    }catch(err){
        res.status(500).send({ status: false, message: err.message })
        
    }
}

module.exports.createvote = createvote
        

