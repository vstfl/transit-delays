import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
    "pk.eyJ1IjoidXJiaXp0b24iLCJhIjoiY2xsZTZvaXd0MGc4MjNzbmdseWNjM213eiJ9.z1YeFXYSbaMe93SMT6muVg";
export const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/urbizton/clvwx8k2p014201rddm6k3eb0", // Default Dark

    center: [-113.5, 53.54],
    zoom: 10,
    maxZoom: 18,
});
map.addControl(
    new mapboxgl.NavigationControl({ visualizePitch: true }),
    "bottom-right",
);
map.addControl(new mapboxgl.ScaleControl({ maxWidth: 200 }));
map.addControl(
    new mapboxgl.FullscreenControl({
        container: document.querySelector("body"),
    }),
    "bottom-right",
);

let changedState = false;
let currentGeoJSON;
// Initial state of map, also ensures points stay the same when style changes
map.on("style.load", () => {
    map.resize();
    console.log("Map resized");
    if (!changedState) {
        updateMapData(currentGeoJSON);
    }
    if (changedState) {
        updateMapData(currentGeoJSON);
    }
});

// Update map, ensure resized properly
export function updateMapData(newGeoJSON) {
    if (map.getLayer("latestLayer")) {
        map.removeLayer("latestLayer");
    }
    if (map.getSource("latestSource")) {
        map.removeSource("latestSource");
    }
    addPointLayer(newGeoJSON);
    changedState = true;
    currentGeoJSON = newGeoJSON;
    // panToAverage(extractCoordinatesFromGeoJSON(currentGeoJSON));
}

// Handle map style change
document.addEventListener("DOMContentLoaded", function () {
    const radios = document.querySelectorAll('.map-styles input[type="radio"]');

    radios.forEach((radio) => {
        radio.addEventListener("click", function () {
            if (this.checked) {
                const mapStyle = this.value;
                setMapStyle(mapStyle);
            }
        });
    });

    function setMapStyle(style) {
        map.setStyle("mapbox://styles/urbizton/" + style);
        console.log("Map style set to:", style);
    }
});

// Customize visualization/interactivity of geoJSON data here
function addPointLayer(geojsonSource) {
    map.addSource("latestSource", {
        type: "geojson",
        data: geojsonSource,
        generateId: true, // Ensure that each feature has a unique ID at the PROPERTY level
    });

    map.addLayer({
        id: "latestLayer",
        type: "circle",
        source: "latestSource",
        paint: {
            "circle-color": [
                "match",
                ["get", "classification"],
                "Undefined",
                "#FFAA00",
                "Bare",
                "#000000",
                "Partly",
                "#909090",
                "Full",
                "#FFFFFF",
                "#FFFFFF",
            ],
            "circle-radius": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                9, // Larger when true
                5,
            ],
            "circle-stroke-width": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                2,
                0.5,
            ],
            "circle-stroke-color": "white",
            "circle-sort-key": "timestamp",
        },
    });
}

// Individual Interactions go down here

// Upon clicking home, pan to Edmonton
function panToEdmonton() {
    map.flyTo({
        center: [-113.5, 53.54],
        zoom: 10,
        pitch: 0,
        bearing: 0,
    });
}
document
    .getElementById("center-edmonton")
    .addEventListener("click", function (event) {
        event.preventDefault();
        panToEdmonton();
    });
