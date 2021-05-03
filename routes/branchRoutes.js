const express = require('express')
const {addBranch,getBranches} = require('../services/branchService')

const cors = require('cors')
const app = express()
app.use(cors())

app.get('/get',getBranches);

app.post('/add',addBranch);

module.exports = app;