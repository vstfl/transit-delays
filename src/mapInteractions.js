import mapboxgl from "mapbox-gl";

import {
    currentMetric,
    currentAggregation,
    createConsoleInformation,
    setIDText
} from "./webInteractions.js";

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

export function fetchGeoJSON(filename) {
    return fetch(filename)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Error loading GeoJSON file:", error);
            throw error; // Re-throw the error to propagate it further if needed
        });
}

let changedState = false;
let currentGeoJSON;

fetchGeoJSON("./assets/Neighborhood.geojson")
    .then((newGeoJSON) => {
        updateMapData(newGeoJSON);
    })
    .catch((error) => {
        console.error("Error fetching GeoJSON:", error);
    });

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
    changedState = true;
    currentGeoJSON = newGeoJSON;
    addDataLayer(newGeoJSON);
}

// Customize visualization/interactivity of geoJSON data here
function addDataLayer(geojsonSource) {
    const layers = map.getStyle().layers;

    let firstSymbolId;
    let labelLayerId;
    for (const layer of layers) {
        if (layer.type === "symbol") {
            firstSymbolId = layer.id;
            break;
        }
    }
    for (const layer of layers) {
        if (layer.type === "symbol" && layer.id === "rail-label") {
            labelLayerId = layer.id;
            break;
        }
    }

    map.addSource("latestSource", {
        type: "geojson",
        data: geojsonSource,
        generateId: true, // Ensure that each feature has a unique ID at the PROPERTY level
    });
    const geometryType = geojsonSource.features[0].geometry.type;

    if (geometryType === "MultiPolygon") {
        map.addLayer(
            {
                id: "latestLayer",
                type: "fill",
                source: "latestSource",
                paint: getPaint(currentMetric, currentAggregation),
            },
            firstSymbolId,
        );
    } else if (geometryType === "Point") {
        map.addLayer(
            {
                id: "latestLayer",
                type: "circle",
                source: "latestSource",
                paint: getPaint(currentMetric, currentAggregation),
            },
            labelLayerId,
        );
    }
}

// Determine point styling depending on metric type
// Function to generate paint object based on currentMetric and currentAggregation
function getPaint(currentMetric, currentAggregation) {
    if (currentAggregation === "Stop") {
        if (currentMetric === "Delay") {
            return {
                "circle-color": [
                    "case",
                    ["boolean", ["feature-state", "hover"], false],
                    "purple",
                    [
                        "interpolate",
                        ["linear"],
                        ["get", "Delay"],
                        0,
                        "#2D7AB5",
                        60,
                        "#81B9D7",
                        120,
                        "#C6E6DB",
                        180,
                        "#FFFFC1",
                        300,
                        "#FECA81",
                        600,
                        "#F07C49",
                        900,
                        "#D41A18",
                    ]
                ],
                "circle-radius": getCircleRadiusProperty(
                    currentGeoJSON,
                    "Delay",
                    5,
                    9,
                ),
                "circle-stroke-width": 0.7,
                "circle-stroke-color": "#666666",
            };
        } else {
            // For people-delay
            return {
                "circle-color": [
                    "case",
                    ["boolean", ["feature-state", "hover"], false],
                    "purple",
                    [
                        "interpolate",
                        ["linear"],
                        ["get", "People-Delay-Mins"],
                        0,
                        "#2D7AB5",
                        60,
                        "#81B9D7",
                        175,
                        "#C6E6DB",
                        325,
                        "#FFFFC1",
                        525,
                        "#FECA81",
                        800,
                        "#F07C49",
                        1150,
                        "#D41A18",
                    ]
                ], // Change color for other metrics
                "circle-radius": getCircleRadiusProperty(
                    currentGeoJSON,
                    "People-Delay-Mins",
                    5,
                    9,
                ), // Change radius for other metrics
                "circle-stroke-width": 0.7,
                "circle-stroke-color": "#666666",
            };
        }
    } else if (currentAggregation === "Neighborhood") {
        if (currentMetric === "Delay") {
            return {
                "fill-color": [
                    "case",
                    ["boolean", ["feature-state", "hover"], false],
                    "purple",
                    ["==", ["get", "delay"], null],
                    "rgba(255, 255, 255, 0.4)", // Default color for null values
                    [
                        "interpolate",
                        ["linear"],
                        ["get", "delay"],
                        0,
                        "#2D7AB5",
                        30,
                        "#81B9D7",
                        60,
                        "#C6E6DB",
                        120,
                        "#FFFFC1",
                        180,
                        "#FECA81",
                        240,
                        "#F07C49",
                        360,
                        "#D41A18",
                    ],
                ],
                "fill-opacity": 0.8,
                "fill-outline-color": "#666666",
            };
        } else {
            // for People-Delay
            return {
                "fill-color": [
                    "case",
                    ["boolean", ["feature-state", "hover"], false],
                    "purple",
                    ["==", ["get", "people-delay"], null],
                    "rgba(255, 255, 255, 0.4)", // Default color for null values
                    [
                        "interpolate",
                        ["linear"],
                        ["get", "people-delay"],
                        0,
                        "#2D7AB5",
                        30,
                        "#81B9D7",
                        90,
                        "#C6E6DB",
                        150,
                        "#FFFFC1",
                        270,
                        "#FECA81",
                        390,
                        "#F07C49",
                        630,
                        "#D41A18",
                    ],
                ],
                "fill-opacity": 0.8,
                "fill-outline-color": "#666666",
            };
        }
    }
}

// !! Individual Interactions go down here

// Function to generate circle-radius property based on property values
function getCircleRadiusProperty(geojson, propertyName, minSize, maxSize) {
    // Find maximum and minimum values of the property within the dataset
    const propertyValues = geojson.features.map(
        (feature) => feature.properties[propertyName],
    );
    const maxPropertyValue = Math.max(...propertyValues);
    const minPropertyValue = Math.min(...propertyValues);

    // Define and return the circle-radius property
    return [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        10, // Color when feature state hover is true
        // Default color when feature state hover is false
        [
            "interpolate",
            ["linear"],
            ["get", propertyName],
            minPropertyValue,
            minSize,
            maxPropertyValue,
            maxSize,
        ]
    ];
}

// Handle map style change
document.addEventListener("DOMContentLoaded", function () {
    const radios = document.querySelectorAll('.map-styles input[type="radio"]');
    const styleInvertElements = document.querySelectorAll(
        ".style-invert, .text-invert",
    );

    radios.forEach((radio) => {
        radio.addEventListener("click", function () {
            const mapStyle = this.value;
            setMapStyle(mapStyle);
            styleInvertElements.forEach((element) => {
                const isDark = mapStyle === "clve9aeu900c501rd7qcn14q6";
                element.classList.toggle("dark", isDark);
            });
        });
    });

    function setMapStyle(style) {
        map.setStyle("mapbox://styles/urbizton/" + style);
        console.log("Map style set to:", style);
    }
});

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

function createEmpty() {
    createConsoleInformation({
    })
};

function createInformation(feature, lat, lng) {
    let prop = feature.properties

    if (currentAggregation == 'Neighborhood') {
        if (currentMetric == 'Delay') {
            // setIDText("map-title", "Delays at Each Neighborhood");
            createConsoleInformation({
                Neighborhood: prop["Friendly Name"],
                'Bus Stops': prop.bus_stops,
                'Delay': prop.delay,
                'Delay CV': prop.delay_cv,
                'Trips': prop.trips,
                'Trips CV': prop.trips_cv
            }, lat, lng);
        } else {
            // setIDText("map-title", "Person-Minute Delays at Each Neighborhood");
            createConsoleInformation({
                Neighborhood: prop["Friendly Name"],
                'Bus Stops': prop.bus_stops,
                'People-Delay': prop['people-delay'],
                'People-Delay CV': prop['people-delay_cv'],
                'Trips': prop.trips,
                'Trips CV': prop.trips_cv,
            }, lat, lng);
        };

    } else {
        if (currentMetric == 'Delay') {
            // setIDText("map-title", "Person-Minute Delays at Each Bus Stop");
            createConsoleInformation({
                'Stop ID': prop.Stop_id,
                Neighborhood: prop["Friendly Name"],
                'Delay' : prop.Delay,
                'Trips' : prop.Trips,
                'Transit Users' : prop["Transit Users"],
                Latitude: prop.lat, // Example latitude
                Longitude: prop.lon, // Example longitude
            }, lat, lng);
        } else {
            // setIDText("map-title", "Delays at Each Bus Stop");
            createConsoleInformation({
                'Stop ID': prop.Stop_id,
                Neighborhood: prop["Friendly Name"],
                'People-Delay-Mins' : prop['People-Delay'],
                'Trips' : prop.Trips,
                'Transit Users' : prop["Transit Users"],
                Latitude: prop.lat, // Example latitude
                Longitude: prop.lon, // Example longitude
            }, lat, lng);
        }
    }
};




let uniqueID = null;
let clickedPoint = false;
let clickedPointData;
let clickedPointLat;
let clickedPointLng;
// General point interactivity
map.on('mouseleave', 'latestLayer', () => {
    map.getCanvas().style.cursor = 'default';

    if (uniqueID) {
        map.setFeatureState(
            { source: 'latestSource', id: uniqueID },
            { hover: false }
        );
        uniqueID = null; // Reset uniqueID
    }

    if (!clickedPoint) {
        createEmpty(); // Reset UI
    } else {
        createInformation(clickedPointData, clickedPointLng, clickedPointLat);
        map.setFeatureState(
            { source: 'latestSource', id: clickedPointData.id },
            { hover: true }
        );
    }
});

map.on('click', 'latestLayer', (event) => {
    const feature = event.features[0];

    if (clickedPoint) {
        map.setFeatureState(
            { source: 'latestSource', id: clickedPointData.id },//modify uniqueId
            { hover: false }
        );
    }

    console.log(event)
    console.log(event.lngLat.lat)
    map.easeTo({
        padding: {left: 200},
        center: [event.lngLat.lng, event.lngLat.lat],
        zoom: 12,
        duration: 1000
    })


    clickedPoint = true;
    uniqueID = feature.id;
    clickedPointData = feature;
    clickedPointLng = event.lngLat.lng
    clickedPointLat = event.lngLat.lat
    console.log(feature)
    createInformation(feature, clickedPointLng, clickedPointLat);
});

// Remove this function if not working properly
map.on('mousemove', 'latestLayer', (event) => {
    map.getCanvas().style.cursor = 'pointer';

    const features = map.queryRenderedFeatures(event.point, { layers: ['latestLayer'] });
    // Check if any features are hovered
    if (features.length > 0) {
        const hoveredFeature = features[0];
        const hoveredFeatureId = hoveredFeature.id;

        // If the hovered feature is different from the currently hovered feature
        if (hoveredFeatureId !== uniqueID) {
            // Clear feature state for the previously hovered feature
            if (uniqueID) {
                map.setFeatureState(
                    { source: 'latestSource', id: uniqueID },
                    { hover: false }
                );
            }

            // Update feature state for the newly hovered feature
            map.setFeatureState(
                { source: 'latestSource', id: hoveredFeatureId },
                { hover: true }
            );

            // Update uniqueID to the newly hovered feature's id
            uniqueID = hoveredFeatureId;

            // Update UI with the hovered feature's information
            createInformation(hoveredFeature);
        }
    }
});
