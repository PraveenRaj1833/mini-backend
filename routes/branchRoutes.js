const express = require('express')
const {addBranch,getBranches} = require('../services/branchService')

const app = express()

app.get('/get',getBranches);

app.post('/add',addBranch);

module.exports = app;