const mongoose = require('mongoose')

const studentCourseSchema = mongoose.Schema({
    courseId : {
        type : String,
        trim : true,
        required : true
    },
    studentId : {
        type : String,
        trim : true,
        required : true
    },
    fromDate : {
        type : Date,
        required : true,
        trim : true
    },
    toDate : {
        type : Date,
        required : true,
        trim : true
    },
    sem : {
        type : Number,
        require : true,
        trim : true
    }
})

studentCourseSchema.index({courseId:1,studentId:1},{unique : true});

const studentCourse = mongoose.model('studentCourse',studentCourseSchema);

module.exports = studentCourse