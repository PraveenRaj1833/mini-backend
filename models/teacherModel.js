const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
    teacherId : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    name : {
        type : String,
        required : true,
        trim : true
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
    gender : {
        type : String,
        required : true,
        trim : true
    }
});

const teacher = mongoose.model('teacher',teacherSchema);

module.exports = teacher;

