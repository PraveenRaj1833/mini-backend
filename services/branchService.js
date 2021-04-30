const branch = require('../models/branchModel');

const getBranches = async (req,res)=>{
    const output = await branch.find();
    res.status(200).json({results:output});
}

const addBranch = async (req,res) => {
    const branch1 = new branch({
        branchId : req.body.branchId,
        branchName : req.body.branchName
    })
    branch1.save().then((results)=>{
        res.status(200).json({msg:"branch inserted",results});
    }).catch(err=>{
        res.status(400).json({msg:"something wentwrong",err});
    })
}

module.exports = {addBranch,getBranches};