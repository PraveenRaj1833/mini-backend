const question = require('../models/questionModel');
const option = require('../models/optionModel');

const getTestQuestions = async (req,res)=>{
    await question.find({testId : req.body.testId}).then(async (results)=>{
        const qsns = [];
        for(i=0;i<results.length;i++){
            const qOptions = await option.find({questionId : results[i].questionId})
            const q = {
                testId : results[i].testId,
                questionId : results[i].questionId,
                desc : results[i].desc,
                qType : results[i].qType,
                marks : results[i].marks,
                options : qOptions
            }
            qsns.push(q);
        }
        res.status(200).json({status : 200, results : qsns})
    }).catch(err=>{
        res.status(400).json({err});
    })
}

const addQuestion = async (req,res)=>{
    const question1 = new question({
        testId : req.body.testId,
        desc : req.body.desc,
        qType : req.body.qType,
        marks : req.body.marks
    });
    await question1.save().then(result=>{
        res.status(200).json({msg:"inserted succesfully",result});
    }).catch(err=>{
        res.status(400).json({err});
    })
}

module.exports = {addQuestion, getTestQuestions}