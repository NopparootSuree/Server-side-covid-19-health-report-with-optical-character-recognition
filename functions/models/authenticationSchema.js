const mongoose = require('mongoose')

const authentication = mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    }
})

module.exports = mongoose.model('authentication', authentication)