const express = require('express');
const course = require('../models/courseModel');
const {getCourses,addCourse} = require('../services/courseService');

const cors = require('cors')
const app = express()
app.use(cors())

app.get('/get',getCourses);

app.post('/add',addCourse);

module.exports = app;