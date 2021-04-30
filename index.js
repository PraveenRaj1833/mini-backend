const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const routes = require('./routes/index')
require('dotenv').config();

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

mongoose.connect('mongodb://localhost/mini',{useNewUrlParser:true})
.then(()=>console.log("database connected"));

app.use('/',routes);

app.listen(process.env.PORT || 3000,()=>console.log("listening at 3000"));