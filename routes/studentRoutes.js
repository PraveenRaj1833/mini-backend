const express = require('express')
const {addStudent, getStudents,getStudentById,registerCourse,getCourses,studentLogin,studentUpdate,
    passwordUpdate,attempTest,getTests} = require('../services/studentService');

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

app.post('/attemptTest',attempTest);

app.post('/getTests',getTests);

module.exports = app;
