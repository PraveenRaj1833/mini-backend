const express = require('express')
const studentRoutes = require('./studentRoutes')
const branchRoutes = require('./branchRoutes')
const courseRoutes = require('./courseRoutes')
const teacherRoutes = require('./teacherRoutes')
const testRoutes = require('./testRoutes')

const cors = require('cors')
const app = express()
app.use(cors())

app.use('/student',studentRoutes);

app.use('/branch',branchRoutes);

app.use('/course',courseRoutes);

app.use('/teacher',teacherRoutes);

app.use('/test',testRoutes);

module.exports = app;