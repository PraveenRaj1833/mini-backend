const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

mongoose.connect('mongodb://localhost/mini',{useNewUrlParser:true})
.then(()=>console.log("database connected"));

app.listen(3000,()=>console.log("listening at 3000"));