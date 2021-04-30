const express = require('express');
const course = require('../models/courseModel');
const {getCourses,addCourse} = require('../services/courseService');

const app = express();

app.get('/get',getCourses);

app.post('/add',addCourse);

module.exports = app;