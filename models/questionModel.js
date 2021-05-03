const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const connection = mongoose.createConnection("mongodb+srv://Praveen:praveen123@cluster0.dav3l.mongodb.net/mini?retryWrites=true&w=majority")
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

questionSchema.plugin(autoIncrement.plugin,{model:'question',field : 'questionId'});

const question = mongoose.model('question',questionSchema);

module.exports = question;

