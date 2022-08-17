mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/light-v10", // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 7, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});

const marker2 = new mapboxgl.Marker({ color: 'black' })
    .setLngLat(campground.geometry.coordinates)
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());
