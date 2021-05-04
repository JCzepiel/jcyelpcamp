const parsedCamp = JSON.parse(camp)
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'showmap', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    center: parsedCamp.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl())

var marker1 = new mapboxgl.Marker()
    .setLngLat(parsedCamp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${parsedCamp.title}</h3><p>${parsedCamp.location}</p>`
            )
    )
    .addTo(map);