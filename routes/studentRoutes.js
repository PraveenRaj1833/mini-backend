const express = require('express')
const {addStudent, getStudents,getStudentById,registerCourse,getCourses,studentLogin,studentUpdate,passwordUpdate} = require('../services/studentService');

const app = express()

app.get('/getAll',getStudents);

app.post('/addStudent',addStudent);

app.post('/getById',getStudentById);

app.post('/registerCourse',registerCourse);

app.post('/login',studentLogin);

app.post('/getCourses',getCourses);

app.post('/updateStudent',studentUpdate);

app.post('/updatePassword',passwordUpdate);

module.exports = app;
