const express = require('express')
const studentRoutes = require('./studentRoutes')
const branchRoutes = require('./branchRoutes')
const courseRoutes = require('./courseRoutes')
const teacherRoutes = require('./teacherRoutes')

const app = express()

app.use('/student',studentRoutes);

app.use('/branch',branchRoutes);

app.use('/course',courseRoutes);

app.use('/teacher',teacherRoutes);

module.exports = app;