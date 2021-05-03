const express = require('express')
const {addTeacher,getTeachers,getTeacherById,teachCourse,getCourses,teacherLogin,teacherUpdate,
    passwordUpdate,getStudentsByCourse,createTest} = require('../services/teacherService')

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

module.exports = app;