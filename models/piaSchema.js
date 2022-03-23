const mongoose = require('mongoose')
const Schema = mongoose.Schema;
/*const newPIA = require('/models/newPIA')*/

const existingPiaSchema = new Schema({
    pia:{
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
        isCollected:{
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
        individualsInfo: {
            type: String,
            required: true
        },
        isDisclosed:{
            type: Boolean,
            required: true
        },
        disclosedInfo:{
            type:String
        }
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    comments:{
        type: String,
    }

}, {timestamps: true}); //auto assign to created at and updated at properties in mongo

const existingPia = mongoose.model('existingPia', existingPiaSchema);
module.exports = existingPia