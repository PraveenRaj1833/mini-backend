const course = require('../models/courseModel');

const addCourse = async (req,res)=>{
    const course1 = new course({
        courseName : req.body.courseName,
        courseId : req.body.courseId,
        credits : req.body.credits
    });
    await course1.save().then(result=>{
        res.status(200).json({msg:"Course Created Susscesfully"});
    }).catch(err=>{
        res.status(400).json({msg : "something went wrong",err});
    })
};

const getCourses = async (req,res)=>{
    const output = await course.find();
    res.status(200).json({results: output});
}

const getCourseById = async (req,res)=>{
    await course.findOne({courseId : req.body.courseId}).then(result=>{
        res.status(200).json({result,status:200});
    }).catch(err=>{
        res.status(400).json({err,status:400});
    })
    
}

module.exports = {addCourse,getCourses,getCourseById};