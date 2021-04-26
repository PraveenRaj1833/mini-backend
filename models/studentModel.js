const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    studentId: {
        type : String,
        trim : true,
        required : true,
        unique : true
    },
    name: {
        type : String,
        trim : true,
        required : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    branchId : {
        type : String,
        required : true,
        trim : true
    },
    address : {
        houseNo : {
            type : String,
            required : true,
            trim : true
        },
        city : {
            type : String,
            required : true,
            trim : true
        },
        district : {
            type : String,
            required : true,
            trim : true
        },
        state : {
            type : String,
            required : true,
            trim : true
        },
        pincode : {
            type : Number,
            required : true,
            trim : true
        }
    },
    phone : {
        type : Number,
        required : true,
        trim : true
    },
    role : {
        type : String,
        required : true,
        trim : true
    },
    year : {
        type : String,
        required : true,
        trim : true
    },
    class : {
        type : String,
        required : true,
        trim : true
    }
});

const student=mongoose.model('student',studentSchema);
module.exports=student;