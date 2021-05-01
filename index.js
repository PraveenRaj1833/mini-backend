const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const routes = require('./routes/index')
require('dotenv').config();

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

const url = 'mongodb+srv://Praveen:praveen123@cluster0.dav3l.mongodb.net/mini?retryWrites=true&w=majority'
mongoose.connect(url,{useNewUrlParser:true})
.then(()=>console.log("database connected"));

app.use('/',routes);

app.listen(process.env.PORT || 3000,()=>console.log("listening at 3000"));