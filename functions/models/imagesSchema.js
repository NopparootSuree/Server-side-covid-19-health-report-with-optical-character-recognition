const mongoose = require('mongoose')

const imagesSchema = mongoose.Schema({
    uuid: {
        type: String
    },
    image_name: {
        type: String
    },
    link: {
        type: String
    }
},{timestamps: true})

module.exports = mongoose.model('image_storage', imagesSchema)