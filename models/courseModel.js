const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    courseId : {
        type : String,
        trim : true,
        required : true,
        unique : true
    },
    courseName : {
        type : String,
        trim : true,
        required : true
    },
    credits : {
        type : Number,
        trim : true, 
    }
});

const course = mongoose.model('course',courseSchema);
module.exports = course;