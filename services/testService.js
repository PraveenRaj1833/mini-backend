const test = require('../models/testModel')

const getAllTests = async (req,res)=>{
    await test.find().then(results=>{
        res.status(200).json({results,status:200});
    }).catch(err=>{
        res.status(400).json({err,msg : "something went wrong"});
    })
}

const addTest = async (req,res)=>{
    const test1 = new test({
        courseId : req.body.courseId,
        duration : req.body.duration,
        totalMarks : req.body.totalMarks,
        dateTime : req.body.dateTime
    });
    await test1.save().then(result => {
        res.status(200).json({msg : "test Created Sucesfully" ,result});
    }).catch(err=>{
        res.status(400).json({msg : "something went wrong", err});
    })
}

module.exports = {getAllTests,addTest};