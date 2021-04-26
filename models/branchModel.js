const mongoose = require('mongoose')

const branchSchema = mongoose.Schema({
    branchName : {
        type : String,
        required : true,
        trim : true
    },
    branchId : {
        type : String,
        required : true,
        trim : true,
        unique : true
    }
});

const branch = mongoose.model('branch',branchSchema);

module.exports = branch;