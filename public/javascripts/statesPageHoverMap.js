// Setup mapbox with our token
mapboxgl.accessToken = mapToken;

// Set up the mapbox with some standard settings. We will center the map on the center of the US
var map = new mapboxgl.Map({
    container: 'stateindexpagemap',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-98.35, 39.50],
    zoom: 3
});

// Keeps track of old selection for our hover logic on map
var hoveredStateOnMapId = null;

// On map load, set up some functionality
map.on('load', function () {
    // Adds a data source from mapbox, this one contains the border information for all states
    map.addSource('states', {
        'type': 'geojson',
        'data': 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'
    });

    // 1) Adds a background fill to every state on the map that starts invisible
    // 2) Adds functionality for when a states' hover state is set to true, tell it to up the opacity on the state's fill to indicate it is being hovered on
    map.addLayer({
        'id': 'state-fills',
        'type': 'fill',
        'source': 'states',
        'layout': {},
        'paint': {
            'fill-color': '#627BC1',
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.5,
                0.0
            ]
        }
    });

    // Adds a layer that is the line borders for all states
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


    // When the user moves the mouse over any state, update that states' hover state, which will trigger the background fill to show or hide
    map.on('mousemove', 'state-fills', function (e) {
        if (e.features.length > 0) {

            // If we already have a state id, that means its time to set hover to false so that it looks deselected
            if (hoveredStateOnMapId !== null) {
                map.setFeatureState(
                    { source: 'states', id: hoveredStateOnMapId },
                    { hover: false }
                );
            }

            // Now look into the event to get the new state id, and set that one to hover = true so that it looks selected
            hoveredStateOnMapId = e.features[0].id;
            map.setFeatureState(
                { source: 'states', id: hoveredStateOnMapId },
                { hover: true }
            );
        }
    });

    // When the mouse leaves any state, set hover = false so it becomes deselected
    map.on('mouseleave', 'state-fills', function () {

        // If a state is being hovered on, set hover to false since the mouse has left and we want it to look deselected
        if (hoveredStateOnMapId !== null) {
            map.setFeatureState(
                { source: 'states', id: hoveredStateOnMapId },
                { hover: false }
            );
        }

        // And then set the hovered state id to null so that it can be reset inside the 'mousemove' function
        hoveredStateOnMapId = null;
    });
});

// Select all the cards on the screen
const allCards = document.querySelectorAll("#stateindexpagecard")

// Set up the data we will use
const parsedArrayOfMapboxStateNamesAndStateIDs = JSON.parse(arrayOfMapboxStateNamesAndStateIDs)

// On load set up event listeners on all cards
addEventListenerToAllCards()

// Keep track of the old link the user has hovered on so that we can remove the hover effect from that state on the map
let oldHoveredStateLinkID = 0

// For each card add the runOnCardHoveredOn(event) function to it
function addEventListenerToAllCards() {
    for (aCard of allCards) {
        aCard.addEventListener('mouseenter', function (event) {
            runOnCardHoveredOn(event)
        })
    }
}

// When the card is hovered on, we want to highlight the state on the map
function runOnCardHoveredOn(event) {
    // Get the title of the card, this will tell us the state name
    var title = ''
    for (possibleTitle of event.target.getElementsByClassName('card-title')) {
        title = possibleTitle.innerText
    }

    // Using our data, find the corresponding mapbox data for that state
    const matchingStateData = parsedArrayOfMapboxStateNamesAndStateIDs.filter(stateData => stateData.STATE_NAME === title)[0];

    // If we have that data, we can now mimic the behavior of hovering on the map even when the user is hovering over the cards
    if (matchingStateData) {

        // If there is an old hovered card, we want to set hover = false so it becomes deselected
        if (oldHoveredStateLinkID !== 0) {
            map.setFeatureState(
                { source: 'states', id: oldHoveredStateLinkID },
                { hover: false }
            )
        }

        // So the new hovered state for later
        oldHoveredStateLinkID = matchingStateData.STATE_ID

        // Set the new hovered state to hover = true so it looks selected
        map.setFeatureState(
            { source: 'states', id: matchingStateData.STATE_ID },
            { hover: true }
        )
    }
}