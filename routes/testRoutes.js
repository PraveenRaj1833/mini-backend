const express = require('express')
const {addTest,getAllTests} = require('../services/testService')
const {addQuestion,getTestQuestions} = require('../services/questionService')
const {addOption} = require('../services/optionService')

const cors = require('cors')
const app = express()
app.use(cors())

app.get('/getAllTests',getAllTests);

app.post('/addTest',addTest);

app.post('/addQuestion',addQuestion);

app.post('/getQuestions',getTestQuestions);

app.post('/addOption',addOption);

module.exports = app;

