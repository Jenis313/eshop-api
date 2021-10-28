//USER ENTITIES RELATED MODELLING
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number
    },
    address: {
        permanentAddress: String,
        temporaryAddress: [String]
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'others']
    },
    dob: {
        type: Date
    },
    country: {
        type: String,
        default: 'Nepal'
    },
    image: {
        type: String
    },
    role: {
        type: Number,
        default: 2
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'active'
    }


})
const UserModel = mongoose.model('user', userSchema)
module.exports = UserModel;