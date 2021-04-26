const mongoose = require('mongoose')

const studentOptionSchema = mongoose.Schema({
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
    optionId : {
        type : String,
        trim : true,
        required : true
    }
})

studentOptionSchema.index({questionId:1,studentId:1},{unique : true});

const studentOption = mongoose.model('studentOption',studentOptionSchema);

module.exports = studentOptionNew1