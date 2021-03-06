const teacher = require('../models/teacherModel');
const course = require('../models/courseModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const branch = require('../models/branchModel');
const login = require('../models/loginModel');
const teacherCourse = require('../models/teacherCourseModel');
const studentCourse = require('../models/studentCourseModel');
const test = require('../models/testModel');
const question = require('../models/questionModel');
const option = require('../models/optionModel');
const questionOption = require('../models/questionOptionModel');
const student = require('../models/studentModel');

const mailer = require('nodemailer');
const schedule = require('node-schedule');
const studentOption = require('../models/studentOptionModel');
const studentAnswer = require('../models/studentAnswerModel');
const studentTest = require('../models/studentTestModel');

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
                    await teacher.deleteOne({teacherId : req.body.teacherId}).then(result2=>{
                        res.status(400).json({msg : "failed to insert",result:result2,err:err,status:400});
                    }).catch(err1=>{
                        res.status(400).json({msg: "failed to insert",status:400,err:err1})
                    })
                });
            }).catch((err2)=>{
                res.status(400).json({msg : "something went wrong",err:err2,status:400});
            });
        }
        else{
            res.status(400).json({msg : "Invalid Branch Id",err:err2,status:400});
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
            res.status(402).json({status : 402,err});
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
    return await jwt.sign(payload,"teacher",{expiresIn : 1800});
}

const teacherUpdate = async (req,res) => {
    const token = req.headers.authorization.split(" ")[1];
    const pl =await jwt.verify(token,"teacher",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
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
            res.status(402).json({status : 402,err});
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
                // userId : req.body.userId,
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


const createTest = async (req,res)=>{
    const token  = req.headers.authorization.split(" ")[1];
    console.log(req.body);
    const pl =await jwt.verify(token,"teacher",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err,status : 402});
        } else {
            return payload;
        }
    });

    const questions = req.body.questions;
    const test1 = new test({
        courseId : req.body.courseId,
        duration : req.body.duration,
        totalMarks : req.body.totalMarks,
        dateTime : req.body.dateTime,
        testType : req.body.testType,
        testName : req.body.testName
    });

    const courseExist = await course.findOne({courseId : req.body.courseId});
    if(courseExist===null)
        res.status(400).json({msg : "Course Id Does Not Exist",courseId : req.body.courseId,status : 400});
    else{
        await test1.save().then(async (result)=>{
            const testId = result.testId;
            for(i=0;i<questions.length;i++){
                console.log(`question ${i}`);
                console.log(questions[i]);
                const question1 = new question({
                    testId : testId,
                    desc :  questions[i].desc,
                    qType : questions[i].qType,
                    marks : questions[i].marks
                });
                await question1.save().then(async (result1)=>{
                    const questionId = result1.questionId;
                    if(questions[i].qType==="mcqs" || questions[i].qType==="checkBox"){
                        const opts = questions[i].options;
                        console.log(opts);
                        for(j=0;j<opts.length;j++){
                            const option1 = new option({
                                questionId : questionId,
                                desc : opts[j].desc
                            });
                            await option1.save().then(async (result2)=>{
                                const optionId = result2.optionId;
                                if(questions[i].qType==="mcqs"){
                                    if(j===parseInt(questions[i].right)){
                                        const questionOption1 = new questionOption({
                                            questionId : questionId,
                                            optionId : optionId
                                        });
                                        await questionOption1.save().catch(err3=>{
                                            res.status(400).json({err : err3,msg : "questionOption gone wrong",status : 400})
                                        })
                                    }
                                }
                                if(questions[i].qType==="checkBox"){
                                    if(questions[i].right.includes(j)){
                                        const questionOption1 = new questionOption({
                                            questionId : questionId,
                                            optionId : optionId
                                        });
                                        await questionOption1.save().catch(err3=>{
                                            res.status(400).json({err : err3,msg : "questionOption gone wrong",status : 400})
                                        })
                                    }
                                }
                                
                            }).catch(err2=>{
                                res.status(400).json({err:err2,msg : "option gone wrong",status : 400})
                            })
                        }
                    }
                }).catch(err1=>{
                    res.status(400).json({err:err1,msg : "question gone wrong",status : 400})
                })
            }
            res.status(200).json({msg : "test Created succesfully",result,status : 200});
            console.log("Ready for emails");
            const mails = [];
            await studentCourse.find({courseId : req.body.courseId}).then((async (results)=>{
                for(i=0;i<results.length;i++){
                    const student1 =  await student.findOne({studentId : results[i].studentId});
                    if(student1!==null)
                        mails.push(student1.email);
                }
            }))
            console.log(mails);
            var transporter = mailer.createTransport({
                service : 'gmail',
                auth : {
                    user : 'emsminiproject@gmail.com',
                    pass : 'mee3@miniproject'
                }
            });
            var schDate = new Date(req.body.dateTime);
            schDate.setHours(schDate.getHours()+5);
            schDate.setMinutes(schDate.getMinutes()+30);
            var dt = schDate.toString();
            var mailOptions = {
                from : 'emsminiproject@gmail.com',
                to : mails,
                subject : `Remainder - ${req.body.testName}`,
                html : `<h2>${courseExist.courseName}</h2>
                            <p>Your test is scheduled at ${dt}</p>`,
                text : `${courseExist.courseName} , Your test is scheduled at ${dt}`
            }
            var pdate = new Date();
            var sendDate;
            var diff = schDate.getTime()-pdate.getTime();
            diff = diff/1000;
            diff = diff/60;
            // if(diff<62){
                sendDate = new Date(pdate);
                sendDate.setMinutes(sendDate.getMinutes()+2);
                // }
            // else{
            //     sendDate = new Date(schDate);
            //     sendDate.setHours(sendDate.getHours()-1);
            // }
            const job = schedule.scheduleJob(sendDate,()=>{
                console.log("sending emails");
                transporter.sendMail(mailOptions,(error,info)=>{
                    if(error)
                        console.log(error);
                    else
                        console.log("Emails sent"+info.response);
                })
            })
        }).catch(err=>{
            res.status(400).json({err,msg : "test gone wrong",status : 400})
        })
    }
}



const editTest = async (req,res)=>{
    const token  = req.headers.authorization.split(" ")[1];
    // console.log(req.body);
    const pl =await jwt.verify(token,"teacher",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
        } else {
            return payload;
        }
    });

    const uptest = {
        testId : req.body.testId,
        testName : req.body.testName,
        testType : req.body.testType,
        duration : req.body.duration,
        dateTime : req.body.dateTime,
        totalMarks : req.body.totalMarks,
        courseId : req.body.courseId
    }

    const prev = await test.findOne({testId : req.body.testId}).catch(err=>{
        res.status(400).json({msg : "something went wrong",status : 400,err});
    })

    const mailSend = true;
    if(prev!==null){
        const prevDate = new Date(prev.dateTime);
        const newDate = new Date(req.body.dateTime);
        if(prevDate.getTime()===newDate.getTime())
            mailSend=false;
    }

    await test.findOneAndUpdate({testId : req.body.testId},{$set : uptest},{new:true}).then(async (result)=>{
        if(result!==null){
            const testId = result.testId;
            const delQue = req.body.deletedQues;
            console.log(delQue);
            for(i=0;i<delQue.length;i++){
                console.log(0);
                const questionId = delQue[i].questionId;
                console.log(1);
                await question.deleteOne({questionId : questionId}).catch(err=>{
                    res.status(400).json({status:400,err:err,msg : "question failed to delete"});
                });
                console.log(2);
                if(delQue[i].qType==="mcqs" || delQue[i].qType==="checkBox"){
                    console.log(3);
                    await option.deleteMany({questionId : questionId}).catch(err1=>{
                        res.status(400).json({status:400,err:err1,msg : "options failed to delete"});
                    });
                    console.log(4);
                    await questionOption.deleteMany({questionId : questionId}).catch(err2=>{
                        res.status(400).json({status:400,err:err2,msg : "right failed to delete"});
                    });
                    // await studentOption.deleteMany({questionId : questionId}).catch(err3=>{
                    //     res.status(400).json({status:400,err:err3,msg : "student options failed to delete"});
                    // });
                    console.log(5);
                }
                console.log(6);
                // else
                //     await studentAnswer.deleteOne({questionId : questionId}).catch(err=>{
                //         res.status(400).json({status:400,msg:"deleting question answer went wrong",err});
                //     });
            }
        
            const questions = req.body.questions;
            for(i=0;i<questions.length;i++){
                if(questions[i].questionId===null || questions[i].questionId===''){
                    const question1 = new question({
                        testId : testId,
                        desc :  questions[i].desc,
                        qType : questions[i].qType,
                        marks : questions[i].marks
                    });
                    await question1.save().then(async (result1)=>{
                        const questionId = result1.questionId;
                        if(questions[i].qType==="mcqs" || questions[i].qType==="checkBox"){
                            const opts = questions[i].options;
                            // console.log(opts);
                            for(j=0;j<opts.length;j++){
                                const option1 = new option({
                                    questionId : questionId,
                                    desc : opts[j].desc
                                });
                                await option1.save().then(async (result2)=>{
                                    const optionId = result2.optionId;
                                    if(questions[i].qType==="mcqs"){
                                        if(j===parseInt(questions[i].right)){
                                            const questionOption1 = new questionOption({
                                                questionId : questionId,
                                                optionId : optionId
                                            });
                                            await questionOption1.save().catch(err3=>{
                                                res.status(400).json({err : err3,msg : "questionOption gone wrong"})
                                            })
                                        }
                                    }
                                    if(questions[i].qType==="checkBox"){
                                        if(questions[i].right.includes(j)){
                                            const questionOption1 = new questionOption({
                                                questionId : questionId,
                                                optionId : optionId
                                            });
                                            await questionOption1.save().catch(err3=>{
                                                res.status(400).json({err : err3,msg : "questionOption gone wrong"})
                                            })
                                        }
                                    }
                                    
                                }).catch(err2=>{
                                    res.status(400).json({err:err2,msg : "option gone wrong"})
                                })
                            }
                        }
                    }).catch(err1=>{
                        res.status(400).json({err:err1,msg : "question gone wrong"})
                    })
                }
                else{
                    const question1 = {
                        testId : testId,
                        desc :  questions[i].desc,
                        qType : questions[i].qType,
                        marks : questions[i].marks
                    };
                    await question.findOneAndUpdate({questionId:questions[i].questionId},{$set : question1})
                    .then(async (result1)=>{
                        console.log("Q"+i);
                        await questionOption.remove({questionId : questions[i].questionId}).then(re=>{
                            console.log("RIGHT OPTIONS DELETED SUCCESFULLY");
                            console.log(re);
                        }).catch(err=>{
                            res.status(400).json({status:400,msg : "deleting right went wrong...",err});
                        })

                        await option.deleteMany({questionId : questions[i].questionId}).then(re=>{
                            console.log("OPTIONS DELETED SUCCESFULLY");
                            console.log(re);
                        }).catch(err=>{
                            res.status(400).json({status:400,msg : "deleting options went wrong...",err});
                        })
                        const questionId = result1.questionId;
                        if(questions[i].qType==="mcqs" || questions[i].qType==="checkBox"){
                            const opts = questions[i].options;
                            // console.log(opts);
                            for(j=0;j<opts.length;j++){
                                
                                const option1 = new option({
                                    questionId : questionId,
                                    desc : opts[j].desc
                                });
                                await option1.save().then(async (result2)=>{
                                    const optionId = result2.optionId;
                                    if(questions[i].qType==="mcqs"){
                                        if(j===parseInt(questions[i].right)){
                                            const questionOption1 = new questionOption({
                                                questionId : questionId,
                                                optionId : optionId
                                            });
                                            await questionOption1.save().catch(err3=>{
                                                console.log("CASE 1");
                                                console.log(questionId,optionId);
                                                res.status(400).json({err : err3,msg : "questionOption gone wrong"})
                                            })
                                        }
                                    }
                                    if(questions[i].qType==="checkBox"){
                                        if(questions[i].right.includes(j)){
                                            const questionOption1 = new questionOption({
                                                questionId : questionId,
                                                optionId : optionId
                                            });
                                            await questionOption1.save().catch(err3=>{
                                                console.log("CASE 2");
                                                console.log(questionId,optionId);
                                                res.status(400).json({err : err3,msg : "questionOption gone wrong"})
                                            })
                                        }
                                    }
                                    
                                }).catch(err2=>{
                                    res.status(400).json({err:err2,msg : "option gone wrong"})
                                })
                            }
                        }
                    }).catch(err1=>{
                        console.log("Q"+i);
                        res.status(400).json({err:err1,msg : "question gone wrong"})
                    })
                }
            }
            res.status(200).json({status:200,msg : "Test Updated Succesfully",result});
            if(mailSend===true){
            
                console.log("Ready for updated emails");
                const mails = [];
                await studentCourse.find({courseId : req.body.courseId}).then((async (results)=>{
                    for(i=0;i<results.length;i++){
                        const student1 =  await student.findOne({studentId : results[i].studentId});
                        if(student1!==null)
                            mails.push(student1.email);
                    }
                }))
                // console.log(mails);
                var transporter = mailer.createTransport({
                    service : 'gmail',
                    auth : {
                        user : 'emsminiproject@gmail.com',
                        pass : 'mee3@miniproject'
                    }
                });
                var schDate = new Date(req.body.dateTime);
                schDate.setHours(schDate.getHours()+5);
                schDate.setMinutes(schDate.getMinutes()+30);
                var dt = schDate.toString();
                var mailOptions = {
                    from : 'emsminiproject@gmail.com',
                    to : mails,
                    subject : `Remainder - ${req.body.testName}`,
                    html : `<h2>${courseExist.courseName}</h2>
                                <p>Your test is rescheduled to ${dt}</p>`,
                    text : `${courseExist.courseName} , Your test is scheduled at ${dt}`
                }
                var pdate = new Date();
                var sendDate;
                var diff = schDate.getTime()-pdate.getTime();
                diff = diff/1000;
                diff = diff/60;
                // if(diff<62){
                    sendDate = new Date(pdate);
                    sendDate.setMinutes(sendDate.getMinutes()+2);
                    // }
                // else{
                //     sendDate = new Date(schDate);
                //     sendDate.setHours(sendDate.getHours()-1);
                // }
                const job = schedule.scheduleJob(sendDate,()=>{
                    console.log("sending emails");
                    transporter.sendMail(mailOptions,(error,info)=>{
                        if(error)
                            console.log(error);
                        else
                            console.log("Emails sent"+info.response);
                    })
                })
            }
        }
    }).catch(err=>{
        res.status(400).json({err:err,msg : "test gone wrong"})
    })
}

const getTests = async (req,res)=>{
    const token  = req.headers.authorization.split(" ")[1];
    console.log(req.body);
    const pl =await jwt.verify(token,"teacher",(err,payload)=>{
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
}


const deleteTest = async (req,res)=>{
    const token  = req.headers.authorization.split(" ")[1];
    console.log(req.body);
    const pl =await jwt.verify(token,"teacher",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
        } else {
            return payload;
        }
    });

    const testId = req.params.testId;
    console.log(testId);
    await test.findOneAndDelete({testId : testId}).then(async (result)=>{
        if(result!==null){
            await question.find({testId : testId}).then(async (result1)=>{
                for(i=0;i<result1.length;i++){
                    const questionId = result1[i].questionId;
                    await question.deleteOne({questionId : questionId}).catch(err=>{
                        res.status(400).json({status:400,err:err,msg : "question failed to delete"});
                    });
                    if(result1[i].qType==="mcqs" || result1[i].qType==="checkBox"){
                        await option.deleteMany({questionId : questionId}).catch(err1=>{
                            res.status(400).json({status:400,err:err1,msg : "options failed to delete"});
                        });
                        await questionOption.deleteMany({questionId : questionId}).catch(err2=>{
                            res.status(400).json({status:400,err:err2,msg : "right failed to delete"});
                        });
                        await studentOption.deleteMany({questionId : questionId}).catch(err3=>{
                            res.status(400).json({status:400,err:err3,msg : "student options failed to delete"});
                        });
                    }
                    else
                        await studentAnswer.deleteOne({questionId : questionId});
                }
            }).catch(err4=>{
                res.status(400).json({status:400,err:err4,msg : "question failed to fetch"});
            });
            await studentTest.deleteMany({testId : testId}).catch(err5=>{
                res.status(400).json({status:400,err:err5,msg : "students results failed to delete"}); 
            });
            res.status(200).json({status : 200,msg : "test Deleted Succesfully"});
        }
    }).catch(err6=>{
        res.status(400).json({status:400,err:err6,msg : "tests failed to delete"}); 
    })
}

const getTestDetails = async (req,res)=>{
    const token  = req.headers.authorization.split(" ")[1];
    console.log(req.body);
    const pl =await jwt.verify(token,"teacher",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
        } else {
            return payload;
        }
    });
    console.log(req.body.testId);
    await test.findOne({testId : req.body.testId}).then(async (result1) => {
        console.log(result1);
        if(result1!==null){
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
                        var right;
                        if(result2[i].qType==="mcqs"){
                            right = await questionOption.findOne({questionId : result2[i].questionId})
                            .catch(err3=>{
                                res.status(400).json({err:err3,msg : "right went wrong",status:400});
                            });
                            console.log(right);
                            right = right.optionId;
                        }
                        else if(result2[i].qType==="checkBox"){
                            const right1 = await questionOption.find({questionId : result2[i].questionId})
                            .catch(err3=>{
                                res.status(400).json({err:err3,msg : "right went wrong",status:400});
                            });
                            console.log(right1);
                            right = right1.map((r1,index)=>{return r1.optionId});
                            console.log(right);
                        }     
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
                    testType : result1.testType,
                    dateTime : result1.dateTime,
                    duration : result1.duration,
                    courseId : result1.courseId,
                    testName : result1.testName,
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

const reviewTest = async (req,res)=>{
    const token  = req.headers.authorization.split(" ")[1];
    console.log(req.body);
    const pl =await jwt.verify(token,"teacher",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
        } else {
            return payload;
        }
    });

    await test.findOne({testId : req.body.testId}).then(async (result1) => {
        // console.log(result1);
        if(result1!==null){
                const answers = [];
                await studentTest.findOne({studentId : req.body.studentId,testId : req.body.testId}).then(async (result)=>{
                    console.log(result);
                    await question.find({testId : req.body.testId}).then(async (result2)=>{
                        // console.log(result2);
                        const questions = [];
                        for(i=0;i<result2.length;i++){
                            console.log("Q"+i);
                            console.log(result2[i].questionId);
                            if(result2[i].qType==="mcqs" || result2[i].qType==="checkBox"){
                                var right;
                                if(result2[i].qType==="mcqs"){
                                    await studentOption.findOne({studentId : req.body.studentId, questionId:result2[i].questionId}).then(resultt=>{
                                        if(resultt!==null){
                                            console.log("attempted");
                                            console.log(resultt);
                                            answers.push({
                                                questionId : result2[i].questionId,
                                                optionId : resultt.optionId
                                            })
                                        }
                                        else{
                                            console.log("UN - attempted");
                                            answers.push({
                                                questionId : result2[i].questionId,
                                                optionId : ''
                                            })
                                        }
                                    }).catch(err=>{
                                        res.status(400).json({status : 400, msg : "something went wrong 2", err});
                                    });

                                    console.log("right")
                                    right = await questionOption.findOne({questionId : result2[i].questionId})
                                    .catch(err3=>{
                                        res.status(400).json({err:err3,msg : "right went wrong",status:400});
                                    });
                                    console.log(right);
                                    right = right.optionId;
                                }
                                else{
                                    await studentOption.find({studentId : req.body.studentId, questionId:result2[i].questionId}).then(resultt=>{
                                        if(resultt!==null){
                                            console.log("attempted");
                                            console.log(resultt);
                                            const options = resultt.map((opt,index)=>{
                                                            return opt.optionId
                                                        })
                                            answers.push({
                                                questionId : result2[i].questionId,
                                                options : options
                                            })
                                        }
                                        else{
                                            console.log("UN - attempted");
                                            answers.push({
                                                questionId : result2[i].questionId,
                                                options : []
                                            })
                                        }
                                    }).catch(err=>{
                                        res.status(400).json({status : 400, msg : "something went wrong 3", err});
                                    })
                                    const right1 = await questionOption.find({questionId : result2[i].questionId})
                                    .catch(err3=>{
                                        res.status(400).json({err:err3,msg : "right went wrong",status:400});
                                    });
                                    console.log("right")
                                    // console.log(right1);
                                    right = right1.map((r1,index)=>{return r1.optionId});
                                    console.log(right);
                                }
                                
        
                                const options =  await option.find({questionId : result2[i].questionId})
                                .catch(err2=>{
                                    res.status(400).json({err:err2,msg : "options went wrong",status:400});
                                });
                                // console.log(options);
        
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
                                await studentAnswer.findOne({studentId : req.body.studentId, questionId:result2[i].questionId}).then(resultt=>{
                                    if(resultt!==null){
                                        console.log("attempted");
                                        console.log(resultt);
                                        answers.push({
                                            questionId :result2[i].questionId,
                                            answer : resultt.description,
                                            marks : resultt.marks===null?'':resultt.marks
                                        })
                                    }
                                    else{
                                        console.log("UN - attempted");
                                        answers.push({
                                            questionId :result2[i].questionId,
                                            answer : '',
                                            marks : ''
                                        })
                                    }
                                }).catch(err=>{
                                    res.status(400).json({status : 400, msg : "something went wrong 3", err});
                                })
        
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
                            studentId : req.body.studentId,
                            totalMarks : result1.totalMarks,
                            dateTime : result1.dateTime,
                            duration : result1.duration,
                            courseId : result1.courseId,
                            testName : result1.testName,
                            testType : result1.testType,
                            attemptDate : result.attemptDate,
                            submitDate : result.submitDate,
                            evaluated : result.evaluated,
                            studentMarks : result.marks,
                            questions : questions,
                            answers : answers
                        }
                        res.status(200).json({status : 200,result:resultLast});
                    }).catch(err4=>{
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

const getSubmissions = async (req,res)=>{
    const token  = req.headers.authorization.split(" ")[1];
    console.log(req.body);
    const pl =await jwt.verify(token,"teacher",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
        } else {
            return payload;
        }
    });

    await studentCourse.find({courseId : req.body.courseId}).then(async (result)=>{
        const submissions=[];
        console.log(result);
        for(i=0;i<result.length;i++){
            const st = await studentTest.findOne({studentId : result[i].studentId,testId : req.body.testId})
                .catch(err=>{
                    res.status(200).json({status : 200,err,msg : "something went wrong 1"});
                });
            console.log(st);
            if(st!==null){
                submissions.push(st);
            }
        }
        res.status(200).json({status : 200, result : submissions });
    }).catch(err1=>{
        res.status(400).json({status : 400,err : err1,msg : "something went wrong 1"});
    })
}

const uploadResult = async (req,res)=>{
    const token  = req.headers.authorization.split(" ")[1];
    console.log(req.body);
    const pl =await jwt.verify(token,"teacher",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
        } else {
            return payload;
        }
    });

    const studentId = req.body.studentId;
    const testId = req.body.testId;
    const answers = req.body.answers;
    var total=0;
    for(i=0;i<answers.length;i++){
        total+=answers[i].marks;
        if(answers[i].qType==="desc"){
            await studentAnswer.findOneAndUpdate({studentId : studentId,questionId : answers[i].questionId},
                {$set : {marks : answers[i].marks}},{new:true}).then(result=>{
                    console.log(result);
                }).catch(err=>{
                    res.status(400).json({status : 400,mag : "somethingg went wrong",err});
                })
        }
    }
    await studentTest.findOneAndUpdate({studentId : studentId, testId : testId},
        {$set : {marks:total,evaluated:true}},{new:true}).then(result1=>{
            // console.log(result1);
            res.status(200).json({status : 200, msg : "result uploaded succesfully",result:result1});
        }).catch(err1=>{
            res.status(400).json({status : 400,msg : "something went wrong",err:err1});
        })
}

const changeAnswer = async (req,res)=>{
    const token  = req.headers.authorization.split(" ")[1];
    console.log(req.body);
    const pl =await jwt.verify(token,"teacher",(err,payload)=>{
        if(err){
            res.status(402).json({status : 402,err});
        } else {
            return payload;
        }
    });

    const pquestion = req.body.pquestion;
    var newRight = req.body.newRight;
    if(pquestion.qType==="mcqs"){
        // await questionOption.deleteOne({questionId:pquestion.questionId}).catch(err=>{
        //     console.log(err);
        //     res.status(400).json({status:400,err,msg : "something went wrong 1"});
        // })
        for(i=0;i<pquestion.options.length;i++){
            if(i===newRight){
                newRight = pquestion.options[i].optionId;
                questionOption.findOneAndUpdate({questionId:pquestion.questionId},
                    {$set:{optionId : pquestion.options[i].optionId}},{new:true}).then(result=>{
                        console.log("updatee donee");
                        console.log(result);
                    })
                    .catch(err=>{
                        console.log(err);
                        res.status(400).json({status : 400,msg : "Something went wrong 1",err});
                    });
                break;
            }
        }
        await studentTest.find({testId : req.body.testId}).then(async (results)=>{
            for(i=0;i<results.length;i++){
                var marks = results[i].marks;
                var opt = await studentOption.findOne({questionId : pquestion.questionId,studentId : results[i].studentId})
                    .catch(err=>{
                        console.log(err);
                        res.status(400).json({status : 400,msg : "Something went wrong 2",err});
                    });
                if(opt!==null){
                    if(pquestion.right===opt.optionId){
                        marks-=parseInt(pquestion.marks);
                    }
                    if(newRight===opt.optionId){
                        marks+=parseInt(pquestion.marks);
                    }
                    await studentTest.updateOne({testId : req.body.testId,studentId : results[i].studentId},
                            {$set : {marks : marks}}).then(resultt=>{
                                console.log("update succesful "+results[i].studentId);
                            })
                }

            }
            res.status(200).json({status : 200,msg : "Succesfully updated"});
        }).catch(err=>{
                console.log(err);
                res.status(400).json({status : 400,msg : "Something went wrong 3",err});
            });
    }
    else{
        await questionOption.deleteMany({questionId:pquestion.questionId}).catch(err=>{
            console.log(err);
            res.status(400).json({status:400,err,msg : "something went wrong 4"});
        });
        const ri8 = [];
        for(i=0;i<newRight.length;i++){
            ri8.push(pquestion.options[newRight[i]].optionId);
            const questionOption1 = new questionOption({
                questionId : pquestion.questionId,
                optionId : pquestion.options[newRight[i]].optionId
            })
            questionOption1.save().then(resultt=>{
                console.log("option saved "+pquestion.options[newRight[i]]);
                console.log(resultt);
            }).catch(err=>{
                console.log(err);
                res.status(400).json({status : 400,msg : "Something went wrong 5",err});
            });
        }

        await studentTest.find({testId : req.body.testId}).then(async (results)=>{
            for(i=0;i<results.length;i++){
                var marks = results[i].marks;
                var opt = await studentOption.find({questionId : pquestion.questionId,studentId : results[i].studentId})
                    .catch(err=>{
                        console.log(err);
                        res.status(400).json({status : 400,msg : "Something went wrong 2",err});
                    });
                if(opt.length!==0){
                    var f=0;
                    if(opt.length===pquestion.right.length){
                        for(j=0;j<opt.length;j++){
                            if(pquestion.right.includes(opt[j].optionId)){
                                continue;
                            }
                            else{
                                f=1;
                                break;
                            }
                        }
                        if(f===0 && j===opt.length)
                        {
                            marks-=parseInt(pquestion.marks);
                            console.log(marks);
                        }
                    }
                    f=0;
                    if(opt.length===ri8.length){
                        for(j=0;j<opt.length;j++){
                            if(ri8.includes(opt[j].optionId)){
                                continue;
                            }
                            else{
                                f=1;
                                break;
                            }
                        }
                        if(f===0 && j===opt.length)
                        {
                            marks+=parseInt(pquestion.marks);
                            console.log(marks);
                        }
                    }
                    await studentTest.updateOne({testId : req.body.testId,studentId : results[i].studentId},
                            {$set : {marks : marks}}).then(resultt=>{
                                console.log("update 2 succesful "+results[i].studentId);
                            })
                }

            }
            console.log("sending response");
            res.status(200).json({status : 200,msg : "succesfully updated"});
        }).catch(err=>{
                console.log(err);
                console.log("edo error");
                res.status(400).json({status : 400,msg : "Something went wrong 3",err});
            });   
    }
}


const forgotPassword = async (req,res)=>{
    const teacherId = req.body.userId;
    console.log(teacherId);
    console.log(req.body);
    const teacher1 = await teacher.findOne({teacherId : teacherId}).catch(err=>{
                        console.log(err);
                        res.status(400).json({status:400,msg:"something went wrong 1"});
                    })
    if(teacher1!==null){
        const login1 = await login.findOne({userId : teacherId}).catch(err=>{
                        console.log(err);
                        res.status(400).json({status:400,msg:"something went wrong 2"});
                    });
        if(login1!==null){
            var code = login1.password.substring(login1.password.length-4);
            code = code+login1.password.substring(0,4);
            var transporter = mailer.createTransport({
                service : 'gmail',
                auth : {
                    user : 'emsminiproject@gmail.com',
                    pass : 'mee3@miniproject'
                }
            });
            var mailOptions = {
                from : 'emsminiproject@gmail.com',
                to : teacher1.email,
                subject : `Password Change`,
                html : `<h2>${code} is your code to change password</h2>
                            <p>Ignore if you haven't tried to change your password</p>`,
                text : `$${code} is your code to change password`
            }
            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log(error);
                    res.status(400).json({status:400,msg : "Error Sending Mail"});
                }
                else{
                    console.log("Emails sent"+info.response);
                    res.status(200).json({status:200,msg : "code sent succesfully"});
                }
            })
        }
        else{
            res.status(400).json({status:400,msg : "Error fetching details"});
        }
    }
    else{
        res.status(400).json({status:400,msg:"Teacher Id doesn't exist"});
    }
}

const verifyCode = async (req,res)=>{
    const code=req.body.code;
    const teacherId = req.body.userId;
    const teacher1 = await teacher.findOne({teacherId : teacherId}).catch(err=>{
                console.log(err);
                res.status(400).json({status:400,msg:"something went wrong 1"});
            })
    if(teacher1!==null){
        const login1 = await login.findOne({userId : teacherId}).catch(err=>{
                console.log(err);
                res.status(400).json({status:400,msg:"something went wrong 2"});
            });
        if(login1!==null){
            var vcode = login1.password.substring(login1.password.length-4);
            vcode = vcode+login1.password.substring(0,4);
            if(code===vcode){
                res.status(200).json({status:200,msg : "code verified succesfully"});
            }
            else{
                res.status(400).json({status:400,msg : "invalid code"});
            }
        }
        else{
            res.status(400).json({status:400,msg : "Error fetching details"});
        }
    }
    else{
        res.status(400).json({status:400,msg:"Teacher Id doesn't exist"});
    }
}

const resetPassword = async (req,res)=>{
    const userId = req.body.userId;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const login1 = await login.findOne({userId : userId}).catch(err=>{
            console.log(err);
            res.status(400).json({status:400,msg:"something went wrong 2"});
        });
    if(login1!==null){
        if(password===confirmPassword){
            const passwd = await bcryptjs.hash(password,10);
            await login.updateOne({userId : userId},{$set : {password : passwd}}).then(result=>{
                console.log(result);
                res.status(200).json({status : 200,msg : "password updated succesfully"});
            }).catch(err=>{
                console.log(err);
                res.status(400).json({status : 400,msg : "something went wrong",err});
            })
        }
        else{
            res.status(400).json({status:400,msg:"Password and confirm Password Doesn't Match"});
        }
    }
    else{
        res.status(400).json({status:400,msg:"Teacher Id doesn't exist"});
    }
}

module.exports = {addTeacher,getTeachers,getTeacherById,teachCourse,getCourses,teacherLogin,teacherUpdate,passwordUpdate
                    ,getStudentsByCourse,createTest,getTests , getTestDetails,deleteTest,getSubmissions,
                    reviewTest,uploadResult,editTest,changeAnswer,forgotPassword,verifyCode,resetPassword};