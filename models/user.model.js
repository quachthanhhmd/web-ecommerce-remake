const mongoose = require('mongoose');

const { randomPassword } = require("../utilities/random");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
        type: String,
        default: randomPassword(8),
    },
    passwordReset: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        default: ''
    },
    roles: {
        type: String,
        default: 'user'
    },
    isVerify: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: false,
        match: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    },
    birthday: {
        type: String,
        required: false
    },
    sex: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },
    address: {
        type: String,
        default: "",
    },
    city: {
        type: String,
        default: "",
    },
    district: {
        type: String,
        default: "",
    },
    cloudinary_id: {
        type: String,
        default: "",
    },
    likes: {
        type: Array,
        default: [],
    },
    facebook: {
        type: Object,
        default: {
            id: '',
            token: '',
        },
    },
    google: {
        type: Object,
        default: {
            id: '',
            token: '',
        },
    },

});

module.exports = mongoose.model('User', userSchema)