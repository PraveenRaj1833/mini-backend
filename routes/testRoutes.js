const express = require('express')
const {addTest,getAllTests} = require('../services/testService')


const app = express();

app.get('/getAllTests',getAllTests);

app.post('/addTest',addTest);


