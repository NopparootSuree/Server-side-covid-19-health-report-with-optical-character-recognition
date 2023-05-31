const mongoose = require('mongoose')

const vital_signs = mongoose.Schema({
    uuid : {
        type: String,
        default: null
    },
    body_temperature: {
        type: Number,
        default: null
    },
    upper_blood_pressure: {
        type: Number,
        default: null
    },
    lower_blood_pressure: {
        type: Number,
        default: null
    },
    pulse_rate: {
        type: Number,
        default: null
    },
    respiratory: {
        type: Number,
        default: null
    },
    pulse_ox: {
        type: Number,
        default: null
    },
    blood_sugar: {
        type: Number,
        default: null
    },
    see_a_doctor: {
        type: String,
        default: null
    },
    sickness: {
        type: String,
        default: 'ไม่มีอาการ'
    }

},{timestamps: true})

module.exports = mongoose.model('vital_sign', vital_signs)