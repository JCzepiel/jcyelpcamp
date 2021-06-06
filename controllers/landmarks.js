const dataLayer = require('../data/landmarks')

module.exports.index = async (req, res) => {
    const uniqueStateNames = await dataLayer.getAllDistinctStates()
    res.render('landmarks/index', { uniqueStateNames })
}

module.exports.stateLandmarks = async (req, res) => {
    const allLandmarksForState = await dataLayer.getAllLandmarksForState(req)
    const stateGeographicCenter = await dataLayer.getGeographicCenterLatitudeAndLongitude(req.params.stateName)
    res.render(`landmarks/state`, { allLandmarksForState, stateGeographicCenter })
}

module.exports.specificLandmark = async (req, res) => {
    const landmarkData = await dataLayer.getLandmarkData(req)
    res.render(`landmarks/landmark`, { landmarkData })
}