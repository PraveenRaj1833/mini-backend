const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const connection = mongoose.createConnection("mongodb+srv://Praveen:praveen123@cluster0.dav3l.mongodb.net/mini?retryWrites=true&w=majority")
autoIncrement.initialize(connection)

const optionSchema = mongoose.Schema({
    questionId : {
        type : Number,
        required : true,
        trim : true
    },
    desc : {
        type : String,
        required : true,
        trim : true
    }
});

optionSchema.plugin(autoIncrement.plugin,{model:'option',field : 'optionId'});

const option = mongoose.model('option',optionSchema);

module.exports = option;

