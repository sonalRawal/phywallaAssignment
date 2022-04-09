const pollModel = require("../model/pollModel");
const { isValid, isValidRequestBody} = require("../validator/validate")
const createpoll = async function (req, res) {
    try{
        const requestBody = req.body;
        const { title , options  } = requestBody

        const pollCreateData = {}
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide details' })
            return
        }

        if (!isValid(title)) {
            res.status(400).send({ status: false, message: 'title is required' })
            return
        }
        pollCreateData[title] = title;

        if(options.length<2){
            res.status(400).send({ status: false, message: 'atlist two options required' })
            return
        }
        for(let i=0;i<options.length;i++){
            pollCreateData.options[i].text = options[i]
        }

        pollCreateData[expireAt] = Date.now() +  '10hr' 

        const data = await pollModel.create(pollCreateData)
        res.status(201).send({status:true,msg:'new poll created', data:data})
        

    }catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}

module.exports.createpoll = createpoll