const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const piaSchema = new Schema({
    id: {
        type: String,   //ID of PIA
        required: true
    },
    name: {
        type: String,   //Name of the PIA
        required: true
    },
    createdBy:{
        type: String,   //ID of user who create PIA
        required: false
    },
    fieldOne:{
        type: String,   //First field within PIA
        required: true
    },
    fieldN:{
        type: String,   //Nth field within PIA
        required: true
    },
    canEdit:{
        type: String,   //array of userIDs who can edit
        required: true
    },
    canAdd:{
        type: String,   //array of userIDs who can add other people
        required: true
    },
    State:{
        type: String,   //'In Progress', 'Read Only', 'etc..'
        required: true  
    }

}, {timestamps: true});

const pia = mongoose.model('Users', userSchema);
module.exports = pia;

