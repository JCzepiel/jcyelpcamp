// Setup mapbox with our token
mapboxgl.accessToken = mapToken;

// Data we will use in our map, contains coordinates for the borders of the selected state
const stateMapBoxData = JSON.parse(stringifiedStateMapBoxData)

// The following is an attempt to create a bounding box based on the states full polygon coordinates, based on https://gis.stackexchange.com/questions/172554/calculating-bounding-box-of-given-set-of-coordinates-from-leaflet-draw
// While this logic does work, the bounding box is a bit strict and limiting so it is not used.
// However I think the data is valuable so I will keep it for now
// TODO: Maybe put this bounding box in our seeds/realdata scraped data!?
var coords = stateMapBoxData.geometry.coordinates;
var lats = []; var lngs = [];

for (var i = 0; i < coords[0].length; i++) {
    lats.push(coords[0][i][1]);
    lngs.push(coords[0][i][0]);
    // The following is not needed to calc bounding box, just so you can see the points
    // var marker = new mapboxgl.Marker()
    //     .setLngLat([coords[0][i][0], coords[0][i][1]])
    //     .addTo(map);
}

// Grab the max and mins for both lat and long
var minlat = Math.min.apply(null, lats),
    maxlat = Math.max.apply(null, lats);
var minlng = Math.min.apply(null, lngs),
    maxlng = Math.max.apply(null, lngs);

// Create a bounding rectangle that can be used 
boundingBox = [[minlng, minlat], [maxlng, maxlat]];

// Sets up the map on the page with some settings, including centering it on the center of the state
var map = new mapboxgl.Map({
    container: 'landmarkstatepagemap', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [stateCenterLongitude, stateCenterLatitude], // starting position [lng, lat]
    zoom: 6//,  starting zoom
    //maxBounds: boundingBox
});

// Add standard controls to the map
map.addControl(new mapboxgl.NavigationControl())

// On load do a few things with the map
map.on('load', function () {
    // Add a data source from map box, used to draw all state borders
    map.addSource('states', {
        'type': 'geojson',
        'data': 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'
    });

    // Add our own data source, which is the coordinates for the boundaries of the selected state
    map.addSource('selectedState', {
        'type': 'geojson',
        'data': stateMapBoxData
    });

    // Draw the borders for all states
    map.addLayer({
        'id': 'state-borders',
        'type': 'line',
        'source': 'states',
        'layout': {},
        'paint': {
            'line-color': '#627BC1',
            'line-width': 2
        }
    });

    // Draw a thicker red border to the currently selected state
    map.addLayer({
        'id': 'selected-state-borders',
        'type': 'line',
        'source': 'selectedState',
        'layout': {},
        'paint': {
            'line-color': '#FF0000',
            'line-width': 6
        }
    });
})

// Parse our data which contains all the landmarks for this state
const allLandmarks = JSON.parse(allLandmarksForStatePreStringified)

// For every landmark, put down a map marker for it
for (aLandmark of allLandmarks) {
    var marker1 = new mapboxgl.Marker()
        .setLngLat([aLandmark.nationalLandmarkCoordinatesGeoJSONFormatted.longitude, aLandmark.nationalLandmarkCoordinatesGeoJSONFormatted.latitude])
        .setPopup(
            // We want a simple popup that contains a link with t he title and a truncated description
            new mapboxgl.Popup({ offset: 25 })
                .setHTML(
                    `
                    <a href="${aLandmark.nationalLandmarkState}/${aLandmark._id}">
                    ${aLandmark.nationalLandmarkName}
                    </a>
                    <p>
                    ${aLandmark.nationalLandmarkDescription.substring(0, 50)}...
                    </p>
                    `
                )
        )
        .addTo(map);
}
