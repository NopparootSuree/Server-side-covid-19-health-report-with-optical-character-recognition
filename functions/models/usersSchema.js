const mongoose = require('mongoose')

const users_detail = mongoose.Schema({
    HNId:{
        type: String
    },
    uuid : {
        type: String
    },
    prename: {
        type: String
    },
    name: {
        type: String
    },
    surname: {
        type: String
    },
    gender: {
        type: String
    },
    birthdate: {
        type: String
    },
    id_card:{
        type: Number
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    subdistrict: {
        type: String
    },
    district: {
        type: String
    },
    province: {
        type: String
    },
    zip_code: {
        type: Number
    },
    phone_number: {
        type: Number
    }

},{timestamps: true})

module.exports = mongoose.model('users_detail', users_detail)