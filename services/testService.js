const test = require('../models/testModel')

const getAllTests = async (req,res)=>{
    await test.find().then(results=>{
        res.status(200).json({results,status:200});
    }).catch(err=>{
        res.status(400).json({err,msg : "something went wrong"});
    })
}

const addTest = async (req,res)=>{
    
}

module.exports = {getAllTests};