const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const connection = mongoose.createConnection("mongodb://localhost/mini")
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

