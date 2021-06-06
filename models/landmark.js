const mongoose = require('mongoose')
const Schema = mongoose.Schema

const landmarkSchema = new Schema({
    nationalLandmarkName: String,
    nationalLandmarkWikipediaLink: String,
    nationalLandmarkImageLink: String,
    nationalLandmarkDateDesignated: String,
    nationalLandmarkState: String,
    nationalLandmarkCity: String,
    nationalLandmarkCoordinates: String,
    nationalLandmarkDescription: String,
})

module.exports = mongoose.model('Landmark', landmarkSchema)
