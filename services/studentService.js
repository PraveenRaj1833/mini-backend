// const studentCourseNew1 = require('../models/studentCourse');
const student=require('../models/studentModel');
const course = require('../models/courseModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const branch = require('../models/branchModel');
const login = require('../models/loginModel');
const studentCourse = require('../models/studentCourseModel');
const test = require('../models/testModel');
const question = require('../models/questionModel');
const option = require('../models/optionModel');
const questionOption = require('../models/questionOptionModel');
const studentOption = require('../models/studentOptionModel');
const studentAnswer = require('../models/studentAnswerModel');
const studentTest = require('../models/studentTestModel');
// const { json } = require('express');
// const student = require('../models/studentModel');

const addStudent = async (req,res)=>{
    console.log(req.body.name , req.body.studentId , req.body.password );
    const passwd = await bcryptjs.hash(req.body.password,10);
    const student1 =  new student({
        name: req.body.name,
        studentId : req.body.studentId,
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
        year : req.body.year,
        class : req.body.class
    });

    const login1 = new login({
        userId : req.body.studentId,
        password : passwd
    })

    await branch.findOne({branchId : req.body.branchId}).then(async (result) => {
        if(result!=null) {
            await student1.save().then(async (result)=>{
                // res.status(200).json({meesage:"created succesfully"})
                await login1.save().then(result1=>{
                    res.status(200).json({msg:"inserted Succesfully",result,status:200});
                }).catch(async (err)=>{
                    await student.deleteOne({studentId:req.body.studentId}).then(result2=>{
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

const getStudents = async (req,res) => {
    console.log("services working");
    await student.find().then(results=>{
        console.log(results);
        const obj = {status:200,results};
        console.log(obj);
        // return obj;
        res.status(200).json({results});
    }).catch(err => {
        res.status(400).json({results : output});
        // return {status:400,err};
    })
}

const getStudentById = async (req,res)=>{
    await student.findOne({studentId : req.body.studentId}).then(result=>{
        res.status(200).json({status:200,result});
    }).catch(err=>{
        res.status(400).json({status:400,err});
    })
}

const registerCourse = async (req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const studentCourse1 = new studentCourse({
        studentId : req.body.studentId,
        courseId : req.body.courseId,
        fromDate : req.body.fromDate,
        toDate : req.body.toDate,
        sem : req.body.sem  
    })

    const pl = await jwt.verify(token,"student",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
        } else {
            return payload;
        }
    })

    if(pl.studentId!==req.body.studentId) {
        res.status(400).json({msg : "You dont have access to other's courses",status:400});
    }

    await student.find({studentId : req.body.studentId})
    .then(async (results)=>{
        if(results.length==0)
            res.status(400).json({msg : "Student Id does not exist",status:400});
        else {
            await course.find({courseId : req.body.courseId})
            .then(async (results1) => {
                if(results1.length==0)
                    res.status(400).json({status : 400,msg : "Course Id does not exist"});
                else {
                    await studentCourse1.save().then(result2=>{
                        res.status(200).json({status:200,msg : "registered Succesfully",result : result2});
                    }).catch(err2=>{res.status(400).json({status:400,msg : "something went wrong1",error : err2})});
                }
            }).catch(err1=>{res.status(400).json({status : 400, msg : "something went wrong2",error : err1})});
        }
    }).catch(err=>{res.status(400).json({status : 400, msg : "something went wrong3",error : err})});
}

const getCourses = async (req,res) => {
    await studentCourse.find({studentId : req.body.studentId}).then(async (results)=>{
        const regCourses = [];
        for(i=0;i<results.length;i++){
            const c = await course.findOne({courseId : results[i].courseId});
            // result.courseName = c.courseName;
            // result.credits = c.credits;
            const result = {
                sem : results[i].sem,
                fromDate : results[i].fromDate,
                toDate : results[i].toDate, 
                courseName : c.courseName,
                credits  : c.credits,
                courseId : c.courseId
            }
            // console.log(result)
            // console.log(c)
            regCourses.push(result)
        }
        res.status(200).json({status:200,results:regCourses});
    }).catch(err=>{
        res.status(400).json({status:400,err});
    })
    
}

const studentLogin = async (req,res) => {
    const {userId,password} = req.body;
    const login1 = await login.findOne({userId : userId});
    if(login1!=null) {
        if(await bcryptjs.compare(password,login1.password)) {
            const token = await generateToken({studentId:userId,role : "student"});
            const student1 = await student.findOne({studentId : userId});
            res.status(200).json({status:200,token,student:student1});
        }
        else 
        res.status(400).json({status:400,msg:"Incorrect Password"});
    }
    else {
        res.status(400).json({status:400, msg: "Invalid UserId"});
    }
}

const generateToken = async (payload) => {
    return await jwt.sign(payload,"student",{expiresIn : 1800});
}

const studentUpdate = async (req,res) => {
    const token = req.headers.authorization.split(" ")[1];
    const pl =await jwt.verify(token,"student",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
        } else {
            return payload;
        }
    });
    if(pl.studentId!==req.body.studentId){
        res.status(400).json({msg : "Authentication error",status : 400})
    }

    const student1 =  {
        name: req.body.name,
        studentId : req.body.studentId,
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
        year : req.body.year,
        class : req.body.class
    };

    await branch.findOne({branchId : req.body.branchId}).then(async (result1) => {
        if(result1!=null) {
            await student.findOneAndUpdate({studentId : req.body.studentId},{$set : student1},{new : true}).then(async (result)=>{
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
    const pl =await jwt.verify(token,"student",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
        } else {
            return payload;
        }
    });
    console.log("payload");
    console.log(pl);
    if(pl.studentId!==req.body.userId){
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

const getTests = async (req,res)=>{
    const token  = req.headers.authorization.split(" ")[1];
    console.log(req.body);
    const pl =await jwt.verify(token,"student",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
        } else {
            return payload;
        }
    });

    await test.find({courseId : req.body.courseId}).then(results=>{
        res.status(200).json({status : 200,results});
    }).catch(err=>{
        res.status(400).json({status : 400,err});
    })
    console.log("get tests");
}

const getTestDetails = async (req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const pl =await jwt.verify(token,"student",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
        } else {
            return payload;
        }
    });
    await test.findOne({testId : req.body.testId}).then(async (result1) => {
        console.log(result1);
        if(result1!==null){
           
                await studentTest.findOne({studentId : req.body.studentId,testId : req.body.testId}).then(result=>{
                    if(result!==null){
                        res.status(203).json({status:203,msg : "You cannot attempt the test again",result:result1});
                    }
                }).catch(err=>{
                    res.status(400).json({status : 400, msg : "something went wrong 1", err});
                }) 
                
                res.status(200).json({status : 200,result:result1});
        }
        else{
            res.status(400).json({status : 400,msg:"test Id not Found"});
        }
    }).catch(err1 => {
        res.status(400).json({status : 400,err : err1,msg:"something went wrong"});
    })
}

const getResult = async (req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const pl =await jwt.verify(token,"student",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
        } else {
            return payload;
        }
    });

    const studentId = req.body.studentId;
    const testId = req.body.testId;

    await studentTest.findOne({studentId : studentId, testId : testId}).then(result=>{
        if(result===null){
            res.status(200).json({result,attempt : false,eval : false,status:200});
        }
        else{
            if(result.evaluated===true)
                res.status(200).json({result,attempt : true, eval : true,status:200});
            else
                res.status(200).json({result,attempt : true, eval : false,status:200});
        }
    }).catch(err=>{
        res.status(400).json({status:400,err,msg : "something went wrong"});
    })
}

const reviewTest = async (req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const pl =await jwt.verify(token,"student",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
        } else {
            return payload;
        }
    });

    await test.findOne({testId : req.body.testId}).then(async (result1) => {
        console.log(result1);
        if(result1!==null){
                var attempt = true;
                const answers = [];
                await studentTest.findOne({studentId : req.body.studentId,testId : req.body.testId}).then(async (result)=>{
                    if(result===null){
                        // res.status(203).json({status:203,msg : "You have not attempted the test",result:result1});
                        attempt = false;
                    }
                    await question.find({testId : req.body.testId}).then(async (result2)=>{
                        console.log(result2);
                        const questions = [];
                        for(i=0;i<result2.length;i++){
                            console.log("Q"+i);
                            console.log(result2[i].questionId);
                            if(result2[i].qType==="mcqs" || result2[i].qType==="checkBox"){
                                var right;
                                if(result2[i].qType==="mcqs"){
                                    if(attempt===true){
                                        await studentOption.findOne({studentId : req.body.studentId, questionId:result2[i].questionId}).then(resultt=>{
                                            if(resultt!==null){
                                                answers.push({
                                                    questionId : result2[i].questionId,
                                                    optionId : resultt.optionId
                                                })
                                            }
                                            else{
                                                answers.push({
                                                    questionId : result2[i].questionId,
                                                    optionId : ''
                                                })
                                            }
                                        }).catch(err=>{
                                            res.status(400).json({status : 400, msg : "something went wrong 2", err});
                                        });
                                    }
                                    else{
                                        answers.push({
                                            questionId : result2[i].questionId,
                                            optionId : ''
                                        })
                                    }

                                    right = await questionOption.findOne({questionId : result2[i].questionId})
                                    .catch(err3=>{
                                        res.status(400).json({err:err3,msg : "right went wrong",status:400});
                                    });
                                    console.log(right);
                                    right = parseInt(right.optionId);
                                }
                                else{
                                    if(attempt===true){
                                        await studentOption.find({studentId : req.body.studentId, questionId:result2[i].questionId}).then(resultt=>{
                                            if(resultt!==null){
                                                const options = resultt.map((opt,index)=>{
                                                                return opt.optionId
                                                            })
                                                answers.push({
                                                    questionId : result2[i].questionId,
                                                    options : options
                                                })
                                            }
                                            else{
                                                answers.push({
                                                    questionId : result2[i].questionId,
                                                    options : []
                                                })
                                            }
                                        }).catch(err=>{
                                            res.status(400).json({status : 400, msg : "something went wrong 3", err});
                                        })
                                    }
                                    else{
                                        answers.push({
                                            questionId : result2[i].questionId,
                                            options : []
                                        })
                                    }
                                    
                                    const right1 = await questionOption.find({questionId : result2[i].questionId})
                                    .catch(err3=>{
                                        res.status(400).json({err:err3,msg : "right went wrong",status:400});
                                    });
                                    console.log(right1);
                                    right = right1.map((r1,index)=>{return parseInt(r1.optionId)});
                                    console.log(right);
                                }
                                
        
                                const options =  await option.find({questionId : result2[i].questionId})
                                .catch(err2=>{
                                    res.status(400).json({err:err2,msg : "options went wrong",status:400});
                                });
                                console.log(options);
        
                                const obj = {
                                    questionId : result2[i].questionId,
                                    desc : result2[i].desc,
                                    qType : result2[i].qType,
                                    marks : result2[i].marks,
                                    options : options,
                                    right : right
                                };
                                questions.push(obj);
                            }
                            else{
                                if(attempt===true){
                                    await studentAnswer.findOne({studentId : req.body.studentId, questionId:result2[i].questionId}).then(resultt=>{
                                        if(resultt!==null){
                                            answers.push({
                                                questionId :result2[i].questionId,
                                                answer : resultt.description,
                                                marks : resultt.marks
                                            })
                                        }
                                        else{
                                            answers.push({
                                                questionId :result2[i].questionId,
                                                answer : '',
                                                marks : 0
                                            })
                                        }
                                    }).catch(err=>{
                                        res.status(400).json({status : 400, msg : "something went wrong 3", err});
                                    })
                                }
                                else{
                                    answers.push({
                                        questionId :result2[i].questionId,
                                        answer : '',
                                        marks : 0
                                    })
                                }
        
                                const obj = {
                                    questionId : result2[i].questionId,
                                    desc : result2[i].desc,
                                    qType : result2[i].qType,
                                    marks : result2[i].marks,
                                };
                                questions.push(obj);
                            }
                        }
                        const resultLast = {
                            testId : result1.testId,
                            totalMarks : result1.totalMarks,
                            dateTime : result1.dateTime,
                            duration : result1.duration,
                            courseId : result1.courseId,
                            testName : result1.testName,
                            testType : result1.testType,
                            questions : questions,
                            answers : answers,
                            marks : attempt===true?result.marks:0,
                            attemptDate : attempt===true?result.attemptDate:null,
                            submitDate : attempt===true?result.submitDate:null,
                            attempt : attempt
                        }
                        res.status(200).json({status : 200,result:resultLast});
                    }).catch(err4=>{
                        console.log("hihi",err4);
                        res.status(400).json({err:err4,msg : "questions went wrong",status:400});
                    });
                }).catch(err=>{
                    res.status(400).json({status : 400, msg : "something went wrong 1", err});
                })           
        }
        else{
            res.status(400).json({status : 400,msg:"test Id not Found"});
        }
    }).catch(err1 => {
        res.status(400).json({status : 400,err : err1,msg:"something went wrong"});
    })    
}

const attempTest = async (req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const pl =await jwt.verify(token,"student",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
        } else {
            return payload;
        }
    });
    await test.findOne({testId : req.body.testId}).then(async (result1) => {
        console.log(result1);
        if(result1!==null){
           
                await studentTest.findOne({studentId : req.body.studentId,testId : req.body.testId}).then(result=>{
                    if(result!==null){
                        res.status(203).json({status:203,msg : "You cannot attempt the test again",result:result1});
                    }
                }).catch(err=>{
                    res.status(400).json({status : 400, msg : "something went wrong 1", err});
                })

            await question.find({testId : req.body.testId}).then(async (result2)=>{
                console.log(result2);
                const questions = [];
                for(i=0;i<result2.length;i++){
                    console.log("Q"+i);
                    console.log(result2[i].questionId);
                    if(result2[i].qType==="mcqs" || result2[i].qType==="checkBox"){

                        const options =  await option.find({questionId : result2[i].questionId})
                        .catch(err2=>{
                            res.status(400).json({err:err2,msg : "options went wrong",status:400});
                        });
                        console.log(options);

                        const obj = {
                            questionId : result2[i].questionId,
                            desc : result2[i].desc,
                            qType : result2[i].qType,
                            marks : result2[i].marks,
                            options : options
                        };
                        questions.push(obj);
                    }
                    else{
                         const obj = {
                            questionId : result2[i].questionId,
                            desc : result2[i].desc,
                            qType : result2[i].qType,
                            marks : result2[i].marks,
                        };
                        questions.push(obj);
                    }
                }
                const result = {
                    testId : result1.testId,
                    totalMarks : result1.totalMarks,
                    dateTime : result1.dateTime,
                    duration : result1.duration,
                    courseId : result1.courseId,
                    testName : result1.testName,
                    testType : result1.testType,
                    questions : questions
                }
                res.status(200).json({status : 200,result});
            }).catch(err4=>{
                res.status(400).json({err:err4,msg : "questions went wrong",status:400});
            });
        }
        else{
            res.status(400).json({status : 400,msg:"test Id not Found"});
        }
    }).catch(err1 => {
        res.status(400).json({status : 400,err : err1,msg:"something went wrong"});
    })
}

const submitTest = async (req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const pl =await jwt.verify(token,"student",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
        } else {
            return payload;
        }
    });

    const answers = req.body.answers;
    const studentId = req.body.studentId;
    const testId = req.body.testId;
    for(i=0;i<answers.length;i++){
        if(answers[i].qType==="mcqs"){
            const studentOption1 = new studentOption({
                studentId : studentId,
                questionId : answers[i].questionId,
                optionId : answers[i].optionId
            });
            if(answers[i].optionId!=="" && answers[i].optionId!==null){
                await studentOption1.save().then(result=>{
                    console.log(result);
                }).catch(err=>{
                    res.status(400).json({err:err,msg : "something went wrong",status:400});
                })
            }
        }
        else if(answers[i].qType==="checkBox"){
            for(j=0;j<answers[i].options.length;j++){
                const studentOption1 = new studentOption({
                    studentId : studentId,
                    questionId : answers[i].questionId,
                    optionId : answers[i].options[j]
                })
                studentOption1.save().then(result=>{
                    console.log(result);
                }).catch(err=>{
                    res.status(400).json({err:err,msg : "something went wrong",status:400});
                });
            }
        }
        else{
            const studentAnswer1 = new studentAnswer({
                studentId : studentId,
                questionId : answers[i].questionId,
                description : answers[i].answer
            });
            studentAnswer1.save().then(result=>{
                console.log(result);
            }).catch(err=>{
                res.status(400).json({err:err,msg : "something went wrong",status:400});
            });
        }
    }
    // if(req.body.testType==="mcqs"){

    // }
    res.status(200).json({status : 200,msg : "Test Submitted Succesfully"});
    if(req.body.testType==="mcqs"){
        await calculateResult(studentId, answers, testId,req.body.attemptDate, req.body.submitDate);
    }
    else{
        const studentTest1 = new studentTest({
            studentId : studentId,
            testId : testId,
            marks : 0,
            attemptDate : req.body.attemptDate,
            submitDate : req.body.submitDate,
            evaluated : false
        });
        studentTest1.save().then(result6=>console.log(result6))
            .catch(err=>console.log(err));
    }
}

const calculateResult = async (studentId, answers, testId , attemptDate , submitDate)=>{
    var marks = 0;
    console.log("calculating..");
    console.log(studentId,testId,answers);
    for(i=0;i<answers.length;i++){
        if(answers[i].qType==="mcqs"){
            await questionOption.findOne({questionId : answers[i].questionId}).then(async (result)=>{
                if(result!==null){
                    if(answers[i].optionId===result.optionId)
                    {
                        marks+=parseInt(answers[i].marks);
                        console.log(marks);
                    }
                }
            }).catch(err=>{
                console.log(err);
            })
        }
        else if(answers[i].qType==="checkBox"){
            await questionOption.find({questionId : answers[i].questionId}).then(async (result)=>{
                if(result.length!==0){
                    var f=0;
                    if(result.length===answers[i].options.length){
                        for(j=0;j<result.length;j++){
                            if(answers[i].options.includes(result[j].optionId)){
                                continue;
                            }
                            else{
                                f=1;
                                break;
                            }
                        }
                        if(f===0 && j===result.length)
                        {
                            marks+=parseInt(answers[i].marks);
                            console.log(marks);
                        }
                    }
                }
            })
        }
    }
    const studentTest1 = new studentTest({
        studentId : studentId,
        testId : testId,
        marks : marks,
        attemptDate : attemptDate,
        submitDate : submitDate,
        evaluated : true
    });
    console.log(studentTest1);
    studentTest1.save().then(result=>console.log(result))
            .catch(err=>{
                console.log(err);
            })
}

module.exports = {addStudent, getStudents,getStudentById,registerCourse,getCourses,studentLogin,
    studentUpdate,passwordUpdate,attempTest,getTests,submitTest,getTestDetails,getResult,reviewTest};