const { update } = require('../models/loginModel');
// const login = require('../models/loginModel');
const {addStudent,getStudents,getStudentById,registerCourse,getCourses,studentLoginn,studentUpdate,passwordUpdate} = require('../services/studentService')

const add = async (req,res)=>{
    const output = await addStudent(req,res);
    if(output.status==200) {
        res.status(200).json({msg:output.msg,result:output.result});
    }
    else {
        res.status(400).json({msg : output.msg,err:output.err});
    }
}

const getAll = async (req,res)=>{
    console.log("get all called");
    const output = await getStudents(req,res);
    console.log(output);
    if(output.status==200) {
        res.status(200).json({result:output.result});
    }
    else {
        res.status(400).json({err:output.err,msg:"something went wrong"});
    }
}

const getById = async (req,res)=> {
    const output = await getStudentById(req,res);
    if(output.status==200){
        if(output.result!==null) {
            res.status(200).json({result:output.result});
        }
        else{
            res.status(200).json({msg : `no student found with Id - ${req.body.studentId}`});
        }
    }
    else{
        res.status(400).json({err:output.err,msg:"something went wrong"});
    }
}

const register = async (req,res)=> {
    const output = await registerCourse(req,res);
    if(output.status==200) {
        res.status(200).json({result:output.result,msg:output.msg});
    }
    else{
        res.status(400).json({msg : output.msg, err:output.err});
    }
}

const getRegisteredCourses = async (req,res)=>{
    const output =  await getCourses(req,res);
    if(output.status==200) {
        res.status(200).json({result:output.result});
    }
    else {
        res.status(400).json({err:output.err,msg:"something went wrong"});
    }
}

const studentLogin = async (req,res) => {
    const output = await studentlogin(req,res);
    if(output.status==200){
        res.status(200).json(output);
    }
    else{
        res.status(200).json(output);
    }
}

const updateStudent = async (req,res)=>{
    const output = await studentUpdate(req,res);
    if(output.status==200) {
        res.status(200).json(output);
    }
    else{
        res.status(400).json(output);
    }
}

const updatePassword = async (req,res)=>{
    const output = await passwordUpdate(req,res);
    if(output.status==200) {
        res.status(200).json(output);
    }
    else{
        res.status(400).json(output);
    }
}

module.exports = {add,getAll,getById,register,getRegisteredCourses,studentLogin,updateStudent,updatePassword};