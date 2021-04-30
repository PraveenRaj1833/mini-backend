const express = require('express')
const {addTeacher,getTeachers,getTeacherById,teachCourse,getCourses,teacherLogin,teacherUpdate,
    passwordUpdate,getStudentsByCourse} = require('../services/teacherService')

const app = express()

app.post('/add',addTeacher);

app.get('/get',getTeachers);

app.post('/getById',getTeacherById);

app.post('/getCourses',getCourses);

app.post('/getStudentsRegistered',getStudentsByCourse);

app.post('/teachCourse',teachCourse);

app.post('/login',teacherLogin);

app.post('/updateTeacher',teacherUpdate);

app.post('/updatePassword',passwordUpdate);

module.exports = app;