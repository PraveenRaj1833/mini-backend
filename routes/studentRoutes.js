const express = require('express')
const {addStudent, getStudents,getStudentById,registerCourse,getCourses,studentLogin,studentUpdate,passwordUpdate} = require('../services/studentService');

const cors = require('cors')
const app = express()
app.use(cors())

app.get('/getAll',getStudents);

app.post('/addStudent',addStudent);

app.post('/getById',getStudentById);

app.post('/registerCourse',registerCourse);

app.post('/login',studentLogin);

app.post('/getCourses',getCourses);

app.patch('/updateStudent',studentUpdate);

app.patch('/updatePassword',passwordUpdate);

module.exports = app;
