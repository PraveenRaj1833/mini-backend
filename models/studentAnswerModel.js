const mongoose = require('mongoose')

const studentAnswerSchema = mongoose.Schema({
    studentId : {
        type : String,
        trim : true,
        required : true
    },
    questionId : {
        type : String,
        trim : true,
        required : true
    },
    description : {
        type : String,
        trim : true,
        required : true
    }
})

studentAnswerSchema.index({questionId:1,studentId:1},{unique : true});

const studentAnswer = mongoose.model('studentAnswer',studentAnswerSchema);

module.exports = studentAnswer