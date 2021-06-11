// Used to access the databse
const mongoose = require('mongoose')
// Our Landmark model defined in the database
const Landmark = require('../models/landmark')

// Latitude is the points north and south of the equator. Longitude is the points east and west of the prime meridian.
const statesWithGeographicCenters = require('../seeds/realdata/GeographicStateCenters.json')

module.exports.getAllDistinctStates = async () => {
    // Fiund all the distinct values for state from all Landmarks and return as an array
    const uniqueStateNames = await Landmark.distinct('nationalLandmarkState')
    return uniqueStateNames
}

module.exports.getAllLandmarksForState = async (req) => {
    // Get all landmarks from a given state and return as an array
    const allLandmarksForState = await Landmark.find({ nationalLandmarkState: req.params.stateName })
    return allLandmarksForState
}

module.exports.getLandmarkData = async (req) => {
    // Get the landmark with the given ID and return it
    const landmarkData = await Landmark.findById(req.params.id)
    return landmarkData
}

module.exports.getGeographicCenterLatitudeAndLongitude = async (req) => {
    // Set up our return object - which includes seperate latitude and longitude properties to make it easier to access later
    let stateGeographicCenter = new Object()
    stateGeographicCenter.stateName = req.params.stateName
    stateGeographicCenter.latitude = 0
    stateGeographicCenter.longitude = 0
    for (aState of statesWithGeographicCenters) {
        // Find the state the user has selected
        if (aState.stateName == req.params.stateName) {
            // Perform logic to strip the coordinates of any letters, and seperate them into two different strings, then add them to the object
            const geographicCenterString = aState.stateGeographicCenter
            const geographicCenterStringCoordinates = geographicCenterString.split(' ')
            let latitude = geographicCenterStringCoordinates[0]
            let longitude = geographicCenterStringCoordinates[1]

            const regexOfCharactersToRemove = new RegExp(/[nNESW°]/, "gi")
            latitude = latitude.replace(regexOfCharactersToRemove, "")
            longitude = longitude.replace(regexOfCharactersToRemove, "")

            stateGeographicCenter.latitude = latitude
            stateGeographicCenter.longitude = -longitude
        }
    }

    // Return the new object
    return stateGeographicCenter
}