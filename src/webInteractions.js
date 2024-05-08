import { fetchGeoJSON, updateMapData } from "./mapInteractions.js";

const API_KEY = "yes";

window.onload = function () {
    let mapTitle = "Person-Minute Delays at Each Neighborhood"; // Dynamically changed later
    setIDText("map-title", mapTitle);

    // let mapInfo =
    //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi ";
    // mapInfo += mapInfo + mapInfo;
    // setIDText("map-information", mapInfo);
};

function setIDText(id, text) {
    const information = document.getElementById(id);
    information.textContent = text;
}

// Form interactivity logic
export let currentAggregation = "Neighborhood";
export let currentMetric = "People-Delay";
document.addEventListener("DOMContentLoaded", function () {
    const controls = document.querySelectorAll(".interactive-form");
    let selectedOptions = {};

    // Add event listeners for all interactive-form controls
    controls.forEach(function (control) {
        let defaultOption;

        // Iterate over the interactive-text elements within the control
        control
            .querySelectorAll(".interactive-text")
            .forEach(function (interactiveText) {
                // Check if the text content matches the currentAggregation or currentMetric
                if (
                    interactiveText.textContent.trim() === currentAggregation ||
                    interactiveText.textContent.trim() === currentMetric
                ) {
                    defaultOption = interactiveText;
                }
            });

        // If defaultOption is found, set styles and add event listener
        if (defaultOption) {
            defaultOption.style.fontWeight = "bold";
            defaultOption.style.backgroundColor = "rgba(114, 208, 255, 0.17)";
            selectedOptions[control.id] = defaultOption;
            control.addEventListener("click", function (event) {
                toggleBoldnessAndAction(event, selectedOptions);
            });
        }
    });
});

// Function to toggle boldness and trigger action
function toggleBoldnessAndAction(event, selectedOptions) {
    const target = event.target;
    if (target.classList.contains("interactive-text")) {
        const control = target.closest(".interactive-form");
        const selectedOption = selectedOptions[control.id];

        if (selectedOption !== undefined) {
            selectedOption.style.fontWeight = "normal";
            selectedOption.style.backgroundColor = "transparent"; // Reset background color
        }
        target.style.fontWeight = "bold";
        target.style.backgroundColor = "rgba(114, 208, 255, 0.17)"; // Set background color here
        selectedOptions[control.id] = target; // Update the selected option

        const textContent = target.textContent.trim();
        if (textContent === "Delay" || textContent === "People-Delay") {
            currentMetric = textContent;
        } else if (textContent === "Neighborhood" || textContent === "Stop") {
            currentAggregation = textContent;
        }

        console.log(`Selected ${target.textContent}`);
        console.log(
            `Current Config: ${currentMetric} for ${currentAggregation}s`,
        );
        // const assetName =
        fetchGeoJSON(`./assets/${currentAggregation}.geojson`)
            .then((newGeoJSON) => {
                updateMapData(newGeoJSON);
            })
            .catch((error) => {
                console.error("Error fetching GeoJSON:", error);
            });
    }
}

// !! Logic for dynamic information handling

// Function to create and append list items to the console-information div
export function createConsoleInformation(pointData) {
    const consoleInformationDiv = document.getElementById(
        "console-information",
    );

    // Clear existing content
    consoleInformationDiv.innerHTML = "";

    // Create an unordered list element
    const ul = document.createElement("ul");

    // Create list items for each field and value
    for (const [field, value] of Object.entries(pointData)) {
        const li = document.createElement("li");

        // Create spans for field and value and add classes
        const fieldSpan = document.createElement("span");
        fieldSpan.textContent = `${field.charAt(0).toUpperCase() + field.slice(1)}:`;
        fieldSpan.classList.add("field-text"); // Add class for field text

        const valueSpan = document.createElement("span");
        valueSpan.textContent = ` ${value}`;
        valueSpan.classList.add("value-text"); // Add class for value text

        // Append spans to list item
        li.appendChild(fieldSpan);
        li.appendChild(valueSpan);

        ul.appendChild(li);
    }

    const sampleText = document.createElement("p");
    sampleText.textContent =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua sed do eiusmod tempor incididunt ut labore et dolore magna aliqua sed do eiusmod tempor incididunt ut labore et dolore magna aliqua sed do eiusmod tempor incididunt ut labore et dolore magna aliqua sed do eiusmod tempor incididunt ut labore et dolore magna aliqua sed do eiusmod tempor incididunt ut labore et dolore magna aliqua sed do eiusmod tempor incididunt ut labore et dolore magna aliqua sed do eiusmod tempor incididunt ut labore et dolore magna aliqua";

    // Append the unordered list to the console-information div
    consoleInformationDiv.appendChild(ul);
    consoleInformationDiv.appendChild(sampleText);

    // Append Google Maps Street View iframe
    // const iframe = document.createElement("iframe");
    // iframe.setAttribute("width", "100%");
    // iframe.setAttribute("height", "400");
    // iframe.setAttribute("frameborder", "0");
    // iframe.setAttribute(
    //     "style",
    //     "border: none; border-radius: 1rem; padding: 0",
    // );
    // iframe.setAttribute(
    //     "src",
    //     `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=${pointData.latitude},${pointData.longitude}`,
    // );

    // consoleInformationDiv.appendChild(iframe);
}
