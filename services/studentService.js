// const studentCourseNew1 = require('../models/studentCourse');
const student=require('../models/studentModel');
const course = require('../models/courseModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const branch = require('../models/branchModel');
// const { json } = require('express');
// const student = require('../models/studentModel');

const addStudent = async (req)=>{
    console.log(req.body.name , req.body.studentId , req.body.password );
    const passwd = await bcryptjs.hash(req.body.password,10);
    const student1 =  new student({
        name: req.body.name,
        studentId : req.body.studentId,
        email : req.body.email,
        phone : req.body.phone,
        role : req.body.role,
        branchId : req.body.branchId,
        address : {
            houseNo : req.body.houseNo,
            city : req.body.city,
            district : req.body.district,
            state : req.body.state,
            pincode : req.body.pincode
        },
        year : req.body.year,
        class : req.body.class
    });

    await branch.findOne({branchId : req.body.branchId}).then(result => {
        if(result!=null) {
            await student1.save().then(result=>{
                // res.status(200).json({meesage:"created succesfully"})
                return {msg:"inserted Succesfully",result};
            }).catch(err=>{
                return {msg : "something went wrong"};
            });
        }
    })
}

const getStudents = async (req,res) => {
    const output = await student.find();
    res.status(200).json({results : output});
    console.log(output);
}

const getStudentById = async (req,res)=>{
    const output = await student.find({studentId : req.body.studentId});
    res.send(output);
}

const registerCourse = async (req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const studentCourse1 = new studentCourseNew1({
        studentId : req.body.studentId,
        courseId : req.body.courseId,
        fromDate : req.body.fromDate,
        toDate : req.body.toDate,
        sem : req.body.sem  
    })

    const pl = await jwt.verify(token,"student",(err,payload)=>{
        if(err){
            res.send(err)
        } else {
            return payload;
        }
    })

    if(pl.studentId!==req.body.studentId) {
        res.send("You dont have access to other's courses");
    }

    await student.find({studentId : req.body.studentId})
    .then(async (results)=>{
        if(results.length==0)
            res.status(400).json({msg : "Student Id does not exist"});
        else {
            await course.find({courseId : req.body.courseId})
            .then(async (results1) => {
                if(results1.length==0)
                    res.status(400).json({msg : "Course Id does not exist"});
                else {
                    await studentCourse1.save().then(result2=>{
                        res.status(200).json({msg : "inserted Succesfully",result : result2})
                    }).catch(err2=>res.status(400).json({msg : "something went wrong",error : err2}));
                }
            }).catch(err1=>res.status(400).json({msg : "something went wrong",error : err1}));
        }
    }).catch(err=>res.status(400).json({msg : "something went wrong",error : err}));
}

const getCourses = async (req,res) => {
    const output = await studentCourseNew1.find({studentId : req.body.studentId});
    res.status(200).send(output);
}

const login = async (req,res) => {
    const {userId,password} = req.body;
    const student1 = await student.findOne({studentId : userId});
    if(student1!=null) {
        if(await bcryptjs.compare(password,student1.password)) {
            const token = await generateToken({studentId:userId});
            res.status(200).json({token});
        }
        else 
            res.send("invalid password");
    }
    else {
        res.send("invalid user");
    }
}

const generateToken = async (payload) => {
    return await jwt.sign(payload,"student",{expiresIn : 100});
}

module.exports = {addStudent, getStudents,getStudentById,registerCourse,getCourses,login};