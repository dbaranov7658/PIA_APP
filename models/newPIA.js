const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const newPiaSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
}, {timestamps: true}); //auto assign to created at and updated at properties in mongo

const NewPia = mongoose.model('NewPia', newPiaSchema);
module.exports = NewPia