const mongoose = require('mongoose')

const teacherCourseSchema = mongoose.Schema({
    courseId : {
        type : String,
        trim : true,
        required : true
    },
    teacherId : {
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

teacherCourseSchema.index({courseId:1,teacherId:1},{unique : true});

const teacherCourse = mongoose.model('teacherCourse',teacherCourseSchema);

module.exports = teacherCourse