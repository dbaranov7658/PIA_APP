const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const newPia = require('/models/newPIA')

const existingPiaSchema = new Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    pia:{
        type: newPia,
        required: true
    },

    canEdit: [String],
    creator:[],
    status:[],
    comments:[String]

}, {timestamps: true}); //auto assign to created at and updated at properties in mongo

const NewPia = mongoose.model('existingPia', existingPiaSchema);
module.exports = NewPia