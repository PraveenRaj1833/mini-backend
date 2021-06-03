const express = require('express')
const {addTeacher,getTeachers,getTeacherById,teachCourse,getCourses,teacherLogin,teacherUpdate,
    passwordUpdate,getStudentsByCourse,createTest,getTests,getTestDetails,deleteTest,getSubmissions, 
    reviewTest, uploadResult, editTest, changeAnswer, forgotPassword, verifyCode, resetPassword} = require('../services/teacherService')

const cors = require('cors')
const app = express()
app.use(cors())

app.post('/add',addTeacher);

app.get('/get',getTeachers);

app.post('/getById',getTeacherById);

app.post('/getCourses',getCourses);

app.post('/getStudentsRegistered',getStudentsByCourse);

app.post('/teachCourse',teachCourse);

app.post('/login',teacherLogin);

app.post('/updateTeacher',teacherUpdate);

app.post('/updatePassword',passwordUpdate);

app.post('/createTest',createTest);

app.post('/getTests',getTests);

app.post('/getTestDetails',getTestDetails);

app.post('/editTest',editTest);

app.post('/changeAnswer',changeAnswer);

app.post('/forgotPassword',forgotPassword);

app.post('/verifyCode',verifyCode);

app.post('/resetPassword',resetPassword);

app.delete('/deleteTest/:testId',deleteTest);

app.post('/getSubmissions',getSubmissions);

app.post('/reviewTest',reviewTest);

app.post('/uploadResult',uploadResult);

module.exports = app;