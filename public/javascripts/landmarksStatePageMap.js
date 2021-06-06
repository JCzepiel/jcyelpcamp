mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
    container: 'landmarkstatepagemap', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-stateCenterLongitude, stateCenterLatitude], // starting position [lng, lat]
    zoom: 6 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl())
