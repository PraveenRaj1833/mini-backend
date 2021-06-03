const express = require('express')
const {addStudent, getStudents,getStudentById,registerCourse,getCourses,studentLogin,studentUpdate,
    passwordUpdate,attempTest,getTests, submitTest, getTestDetails, getResult, reviewTest,
        forgotPassword,verifyCode,resetPassword} = require('../services/studentService');

const cors = require('cors')
const app = express()
app.use(cors())

app.get('/getAll',getStudents);

app.post('/addStudent',addStudent);

app.post('/getById',getStudentById);

app.post('/registerCourse',registerCourse);

app.post('/login',studentLogin);

app.post('/getCourses',getCourses);

app.post('/updateStudent',studentUpdate);

app.post('/updatePassword',passwordUpdate);

app.post('/forgotPassword',forgotPassword);

app.post('/verifyCode',verifyCode);

app.post('/resetPassword',resetPassword);

app.post('/attemptTest',attempTest);

app.post('/getTests',getTests);

app.post('/submitTest',submitTest);

app.post('/getTestDetails',getTestDetails);

app.post('/getResult',getResult);

app.post('/reviewTest',reviewTest);

module.exports = app;
