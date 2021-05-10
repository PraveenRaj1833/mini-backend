const express = require('express');
const course = require('../models/courseModel');
const {getCourses,addCourse,getCourseById} = require('../services/courseService');

const cors = require('cors')
const app = express()
app.use(cors())

app.get('/get',getCourses);

app.post('/add',addCourse);

app.post('/getById',getCourseById);

module.exports = app;