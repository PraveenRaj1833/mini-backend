const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const connection = mongoose.createConnection("mongodb://localhost/mini")
autoIncrement.initialize(connection)

const questionSchema = mongoose.Schema({
    testId : {
        type : Number,
        required : true,
        trim : true
    },
    desc : {
        type : String,
        required : true,
        trim : true
    },
    qType : {
        type : String,
        required : true,
        trim : true
    },
    marks : {
        type : Number,
        required : true,
        trim  : true
    }
});

questionSchema.plugin(autoIncrement.plugin,{model:'question',field : 'optionId'});

const question = mongoose.model('question',questionSchema);

module.exports = question;

