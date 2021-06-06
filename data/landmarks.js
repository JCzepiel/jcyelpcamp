const mongoose = require('mongoose')
const Landmark = require('../models/landmark')

// Latitude is the points north and south of the equator. Longitude is the points east and west of the prime meridian.
const statesWithGeographicCenters = require('../seeds/realdata/GeographicStateCenters.json')


module.exports.getAllDistinctStates = async () => {
    const uniqueStateNames = await Landmark.distinct('nationalLandmarkState')
    return uniqueStateNames
}

module.exports.getAllLandmarksForState = async (req) => {
    const allLandmarksForState = await Landmark.find({ nationalLandmarkState: req.params.stateName })
    return allLandmarksForState
}

module.exports.getLandmarkData = async (req) => {
    const landmarkData = await Landmark.findById(req.params.id)
    return landmarkData
}

module.exports.getGeographicCenterLatitudeAndLongitude = async (stateName) => {
    let stateGeographicCenter = new Object()
    stateGeographicCenter.stateName = stateName
    stateGeographicCenter.latitude = 0
    stateGeographicCenter.longitude = 0
    for (aState of statesWithGeographicCenters) {
        if (aState.stateName == stateName) {
            const geographicCenterString = aState.stateGeographicCenter
            const geographicCenterStringCoordinates = geographicCenterString.split(' ')
            let latitude = geographicCenterStringCoordinates[0]
            let longitude = geographicCenterStringCoordinates[1]

            const regexOfCharactersToRemove = new RegExp(/[nNESW°]/, "gi")
            latitude = latitude.replace(regexOfCharactersToRemove, "")
            longitude = longitude.replace(regexOfCharactersToRemove, "")

            stateGeographicCenter.latitude = latitude
            stateGeographicCenter.longitude = longitude
        }
    }

    return stateGeographicCenter
}