const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const newPiaSchema = new Schema({
    projectName: {
        type: String,
        required: true
    },
    sponsoringBusinessUnit: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String,
        required: true
    },
    necessaryInfoCollection:{
        type: Boolean,
        required: true
    },
    personalInfo:{
        type: String
    },
    purpose:{
        type: String,
        required: true
    },
    accountableIndividuals: {
        type: String,
        required: true
    },
    infoStoredOutsideOfCanada:{
        type: Boolean,
        required: true
    },
    outSideOfCanada:{
        type:String
    }
}, {timestamps: true}); //auto assign to created at and updated at properties in mongo

const NewPia = mongoose.model('NewPia', newPiaSchema);
module.exports = NewPia