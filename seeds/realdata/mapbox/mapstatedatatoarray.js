const got = require('got'); // Our Network layer
const fs = require('fs').promises; // Supports async file write

const testingArrayData = require('./arrayofstatenameandstateids.json')

const getGeoJSON = async () => {
    // This is the base URL to do everything we need
    const urlToSearch = 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'

    // Get the response from this page
    const response = await got(urlToSearch)

    return response
}

// getGeoJSON().then((response) => {
//     const responseJSON = JSON.parse(response.body)

//     const geoFeatures = responseJSON.features

//     var ourArrayOfStateNameAndStateIDs = []

//     for (aFeature of geoFeatures) {
//         ourArrayOfStateNameAndStateIDs.push(aFeature.properties)
//     }

//     //Save all this data to a.json since we will use it later
//     fs.writeFile(__dirname + '/arrayofstatenameandstateids.json', JSON.stringify(ourArrayOfStateNameAndStateIDs), function (err) {
//         if (err) {
//             return console.log(err);
//         }

//         console.log("The file was saved!");
//     });
// })

const testing = () => {
    console.log(testingArrayData)
}

testing()