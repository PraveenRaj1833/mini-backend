const teacher = require('../models/teacherModel');
const course = require('../models/courseModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const branch = require('../models/branchModel');
const login = require('../models/loginModel');
const teacherCourse = require('../models/teacherCourseModel');
const studentCourse = require('../models/studentCourseModel');

const addTeacher = async (req,res)=>{
    console.log(req.body.name , req.body.teacherId , req.body.password );
    const passwd = await bcryptjs.hash(req.body.password,10);
    const teacher1 =  new teacher({
        name: req.body.name,
        teacherId : req.body.teacherId,
        email : req.body.email,
        phone : req.body.phone,
        gender : req.body.gender,
        role : req.body.role,
        branchId : req.body.branchId,
        address : {
            houseNo : req.body.houseNo,
            city : req.body.city,
            district : req.body.district,
            state : req.body.state,
            pincode : req.body.pincode
        },
    });

    const login1 = new login({
        userId : req.body.teacherId,
        password : passwd
    })

    await branch.findOne({branchId : req.body.branchId}).then(async (result) => {
        if(result!=null) {
            await teacher1.save().then(async (result)=>{
                // res.status(200).json({meesage:"created succesfully"})
                await login1.save().then(result1=>{
                    res.status(200).json({msg:"inserted Succesfully",result,status:200});
                }).catch(async (err)=>{
                    await teacher.deleteOne({teacherId:req.body.teacherId}).then(result2=>{
                        res.status(400).json({msg : "failed to insert",result:result2,err:err,status:400});
                    }).catch(err1=>{
                        res.status(200).json({msg: "failed to insert",status:400,err:err1})
                    })
                });
            }).catch((err2)=>{
                res.status(400).json({msg : "something went wrong",err:err2,status:400});
            });
        }
    }).catch(err=>{
        res.status(400).json({msg : "something went wrong",err:err,status:400});
    })
}

const getTeachers = async (req,res) => {
    console.log("services working");
    await teacher.find().then(results=>{
        console.log(results);
        const obj = {status:200,results};
        console.log(obj);
        // return obj;
        res.status(200).json({results});
    }).catch(err => {
        res.status(400).json({results : output,err});
        // return {status:400,err};
    })
}

const getTeacherById = async (req,res)=>{
    await teacher.findOne({teacherId : req.body.teacherId}).then(result=>{
        res.status(200).json({status:200,result});
    }).catch(err=>{
        res.status(400).json({status:400,err});
    })
}

const teachCourse = async (req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const teacherCourse1 = new teacherCourse({
        teacherId : req.body.teacherId,
        courseId : req.body.courseId,
        fromDate : req.body.fromDate,
        toDate : req.body.toDate,
        sem : req.body.sem  
    })

    const pl = await jwt.verify(token,"teacher",(err,payload)=>{
        if(err){
            res.send(err)
        } else {
            return payload;
        }
    })

    if(pl.teacherId!==req.body.teacherId) {
        res.status(400).json({msg : "You dont have access to other's courses",status:400});
    }

    await teacher.find({teacherId : req.body.teacherId})
    .then(async (results)=>{
        if(results.length==0)
            res.status(400).json({msg : "Teacher Id does not exist",status:400});
        else {
            await course.find({courseId : req.body.courseId})
            .then(async (results1) => {
                if(results1.length==0)
                    res.status(400).json({status : 400,msg : "Course Id does not exist"});
                else {
                    await teacherCourse1.save().then(result2=>{
                        res.status(200).json({status:200,msg : "Course added Succesfully",result : result2});
                    }).catch(err2=>{res.status(400).json({status:400,msg : "something went wrong1",error : err2})});
                }
            }).catch(err1=>{res.status(400).json({status : 400, msg : "something went wrong2",error : err1})});
        }
    }).catch(err=>{res.status(400).json({status : 400, msg : "something went wrong3",error : err})});
}

const getCourses = async (req,res) => {
    await teacherCourse.find({teacherId : req.body.teacherId}).then(results=>{
        res.status(200).json({status:200,results});
    }).catch(err=>{
        res.status(400).json({status:400,err});
    })
    
}

const getStudentsByCourse = async (req,res) => {
    await studentCourse.find({courseId : req.body.courseId}).then(results => {
        res.status(200).json({status:200,results});
    }).catch(err=>{
        res.status(400).json({status:400,err});
    })
}

const teacherLogin = async (req,res) => {
    const {userId,password} = req.body;
    const login1 = await login.findOne({userId : userId});
    if(login1!=null) {
        if(await bcryptjs.compare(password,login1.password)) {
            const token = await generateToken({teacherId:userId,role : "teacher"});
            const teacher1 = await teacher.findOne({teacherId : userId});
            res.status(200).json({status:200,token,teacher:teacher1});
        }
        else 
        res.status(400).json({status:400,msg:"Incorrect Password"});
    }
    else {
        res.status(400).json({status:400, msg: "Invalid UserId"});
    }
}

const generateToken = async (payload) => {
    return await jwt.sign(payload,"teacher",{expiresIn : 500});
}

const teacherUpdate = async (req,res) => {
    const token = req.headers.authorization.split(" ")[1];
    const pl =await jwt.verify(token,"teacher",(err,payload)=>{
        if(err){
            res.send(err)
        } else {
            return payload;
        }
    });
    if(pl.teacherId!==req.body.teacherId){
        res.status(400).json({msg : "Authentication error",status : 400})
    }

    const teacher1 =  {
        name: req.body.name,
        teacherId : req.body.teacherId,
        email : req.body.email,
        phone : req.body.phone,
        role : req.body.role,
        gender : req.body.gender,
        branchId : req.body.branchId,
        address : {
            houseNo : req.body.houseNo,
            city : req.body.city,
            district : req.body.district,
            state : req.body.state,
            pincode : req.body.pincode
        },
    };

    await branch.findOne({branchId : req.body.branchId}).then(async (result1) => {
        if(result1!=null) {
            await teacher.findOneAndUpdate({teacherId : req.body.teacherId},{$set : teacher1},{new : true}).then(async (result)=>{
                // res.status(200).json({meesage:"created succesfully"})
                res.status(200).json({msg:"Details Updated Succesfully",result,status:200});
                }).catch(err1=>{
                    res.status(400).json({msg: "failed to Update",status:400,err:err1});
                })
            }
        else{
            res.status(400).json({msg:"invalid BranchId",status:400});
        }
        }).catch((err2)=>{
            res.status(400).json({msg : "something went wrong",err:err2,status:400});
        });
}

const passwordUpdate = async (req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const pl =await jwt.verify(token,"teacher",(err,payload)=>{
        if(err){
            res.send(err)
        } else {
            return payload;
        }
    });
    console.log("payload");
    console.log(pl);
    if(pl.teacherId!==req.body.userId){
        res.status(400).json({msg : "Authentication error",status : 400})
    }

    const login1 = await login.findOne({userId : req.body.userId});
    if(await bcryptjs.compare(req.body.currentPassword,login1.password)){
        if(req.body.newPassword === req.body.confirmPassword){
            const passwd = await bcryptjs.hash(req.body.newPassword,10);
            const login2 = {
                userId : req.body.userId,
                password : passwd
            };
            login.findOneAndUpdate({userId:req.body.userId},{$set : login2},{new:true}).then(result => {
                res.status(200).json({msg : "password updated succesfully",result})
            }).catch(err=>{
                res.status(400).json({msg : "something went wrong ",err});
            })
        }
        else{
            res.status(400).json({msg:"sorry,Password and confirmPassword doesn't match",status:400});
        }
    }
    else{
        res.status(400).json({msg:"sorry,current password is incorrect",status:400})
    }
}

module.exports = {addTeacher,getTeachers,getTeacherById,teachCourse,getCourses,teacherLogin,teacherUpdate,passwordUpdate
                    ,getStudentsByCourse};