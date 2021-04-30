const mongoose = require('mongoose')

const questionOptionSchema = mongoose.Schema({
    questionId : {
        type : Number,
        required : true,
        trim : true
    },
    optionId : {
        type : Number,
        required : true,
        trim : true
    }
});

questionOptionSchema.index({questionId:1,optionId:1},{unique : true});

const questionOption = mongoose.model('questionOption',questionOptionSchema);

module.exports = questionOption;