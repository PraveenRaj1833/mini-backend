const mongoose = require('mongoose')

const studentTestSchema = mongoose.Schema({
    studentId : {
        type : String,
        trim : true,
        required : true
    },
    testId : {
        type : Number,
        trim : true,
        required : true
    },
    marks : {
        type : Number,     //nod double
        trim : true,
        required : true
    }
})

studentTestSchema.index({testId:1,studentId:1},{unique : true});

const studentTest = mongoose.model('studentTest',studentTestSchema);

module.exports = studentTest