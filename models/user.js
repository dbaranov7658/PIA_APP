const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isOfficer: {
        type: Boolean,
        required: true
    }
}, {timestamps: true});

const User = mongoose.model('Users', userSchema);
module.exports = User;

