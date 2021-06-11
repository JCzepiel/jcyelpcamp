// Used to access our database
const mongoose = require('mongoose')
// Define the schema here so it's easier to use later
const Schema = mongoose.Schema

// The schema for our landmarks, which represents all the data we get back from wikipedia
const landmarkSchema = new Schema({
    nationalLandmarkName: String,
    nationalLandmarkWikipediaLink: String,
    nationalLandmarkImageLink: String,
    nationalLandmarkDateDesignated: String,
    nationalLandmarkState: String,
    nationalLandmarkCity: String,
    nationalLandmarkCoordinates: String,
    nationalLandmarkDescription: String,
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
})

// Set up a virtual property that will contain the coordinates in a more easily usable form because from our data they are just a single string
landmarkSchema.virtual('nationalLandmarkCoordinatesGeoJSONFormatted').get(function () {
    // Set up our new object that we will return
    let landmarkGeoJSONCoordinates = new Object()
    landmarkGeoJSONCoordinates.latitude = '0'
    landmarkGeoJSONCoordinates.longitude = '0'

    const landmarkCoordinatesString = this.nationalLandmarkCoordinates

    // Some landmarks don't have coordinates so just skip those
    // TODO: Setup up some default coordinates so that they actually show up
    if (!landmarkCoordinatesString) {
        return landmarkGeoJSONCoordinates
    }

    // Split the string and then save the two value
    const landmarkCoordinatesStringCoordinates = landmarkCoordinatesString.split(' ')
    let latitude = landmarkCoordinatesStringCoordinates[0]
    let longitude = landmarkCoordinatesStringCoordinates[1]

    // Remove any letters in the coordinates
    const regexOfCharactersToRemove = new RegExp(/[nNESW°]/, "gi")
    latitude = latitude.replace(regexOfCharactersToRemove, "")
    longitude = longitude.replace(regexOfCharactersToRemove, "")

    // Store the Lat and Long in the object so they can be easily accessed later
    landmarkGeoJSONCoordinates.latitude = latitude
    landmarkGeoJSONCoordinates.longitude = -longitude

    // Return our new object with the coordinates inside
    return landmarkGeoJSONCoordinates
})

// Export the model for later use
module.exports = mongoose.model('Landmark', landmarkSchema)
