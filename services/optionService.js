const option = require('../models/optionModel')
const question = require('../models/questionModel')

const addOption = async (req,res)=>{
    const option1 = new option({
        questionId : req.body.questionId,
        desc : req.body.desc
    })
    await question.findOne({questionId : req.body.questionId}).then(async (result)=>{
        if(result!==null){
            await option1.save().then(result=>{
                res.status(200).json({msg : "opt added succesfully",result});
            }).catch(err=>{
                res.status(400).json({err,msg : "something went wrong"});
            })
        }
        else{
            res.status(400).json({msg : "Question Id doesnt exist"});
        }
    })
}

module.exports = {addOption};