const mongoose =  require('mongoose');

const loginSchema = mongoose.Schema({
    userId : {
        type : String,
        trim : true,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});

const login =  mongoose.model('login',loginSchema);

module.exports = login;