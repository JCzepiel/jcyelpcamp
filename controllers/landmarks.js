// This is an array of State Names and their MapBox IDs. This is needed for the client side JS to know what state the user selected
const arrayOfMapboxStateNamesAndStateIDs = require('../seeds/realdata/mapbox/arrayofstatenameandstateids.json')
// Our Network layer
const got = require('got');
// Where we will go to get any database related information
const dataLayer = require('../data/landmarks')

module.exports.allStates = async (req, res) => {
    // Get a list of all the states represented in our Landmarks database
    const uniqueStateNames = await dataLayer.getAllDistinctStates()
    // Render an index page which will show off all the states with landmarks, so the user can select that state
    res.render('landmarks/allstates', { uniqueStateNames, arrayOfMapboxStateNamesAndStateIDs })
}

module.exports.stateLandmarks = async (req, res) => {
    // For the correctly selected state, get all the landmarks in that state
    const allLandmarksForState = await dataLayer.getAllLandmarksForState(req)
    // We also want the selected states geographic center so we can center the map on this page
    const stateGeographicCenter = await dataLayer.getGeographicCenterLatitudeAndLongitude(req)

    // Ok so this is a pain but we need to clean up the data strings for JSON.stringify and then JSON.parse to work.
    // TODO: Long term we should do that when scraping
    // But for now we will do it here. So far I needed to removed "\n"s and "\""s and "\'"
    // https://stackoverflow.com/questions/6640382/how-to-remove-backslash-escaping-from-a-javascript-var
    const allLandmarksForStatePreStringified = JSON.stringify(allLandmarksForState).replace(/[\']/g, "").replace(/\\"/g, 'LOL');


    // This request and parsing is to get the full Mapbox data for this state. So not just name and ID, but also the entire bounding coordinates
    const urlToSearch = 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'
    const response = await got(urlToSearch)
    const responseJSON = JSON.parse(response.body)
    const geoFeatures = responseJSON.features

    // The full map box data for this state will be used to draw a extra box around the state borders to make it obvious it is the selected state
    // TODO: This overlaps with what we do to create arrayOfMapboxStateNamesAndStateIDs inside seeds/realdata. Look into combining all of this there so we don't need to do this extra request crap
    const stateMapBoxData = geoFeatures.filter(stateData => stateData.properties.STATE_NAME === req.params.stateName)[0];
    const stringifiedStateMapBoxData = JSON.stringify(stateMapBoxData)

    // Render a page that will display all landmarks in the state, center the map on the state and also draw an extra border around the state
    res.render(`landmarks/state`, { allLandmarksForState, allLandmarksForStatePreStringified, stateGeographicCenter, stringifiedStateMapBoxData })
}

module.exports.specificLandmark = async (req, res) => {
    // Get the data for this specific landmark
    const landmarkData = await dataLayer.getLandmarkData(req)
    // Display the details page for this specific landmark
    res.render(`landmarks/landmark`, { landmarkData })
}