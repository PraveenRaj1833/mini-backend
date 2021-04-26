const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment')

const connection = mongoose.createConnection("mongodb://localhost/mini");

autoIncrement.initialize(connection);
const testSchema = mongoose.Schema({
    courseId: {
        type : String,
        trim : true,
        required : true
    },
    dateTime: {
        type : Date,          //only date
        required : true
    },
    totalMarks: {
        type : Number,        //error  (no double)
        required : true               
    }
});

testSchema.plugin(autoIncrement.plugin,{model:'test',field : 'testId'});

const test=mongoose.model('test',testSchema);
module.exports=test;