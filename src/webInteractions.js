
const API_KEY = 'apikeygoeshere';

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
document.addEventListener("DOMContentLoaded", function () {
    const controls = document.querySelectorAll(".interactive-form");
    let selectedOptions = {};

    // Function to toggle boldness and trigger action
    function toggleBoldnessAndAction(event) {
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

            console.log(`Selected ${target.textContent}`);
            // TODO: Add function here to load the specific data, and change console texts
        }
    }

    // Add event listeners for all interactive-form controls
    controls.forEach(function (control) {
        const defaultOption = control.querySelector(".interactive-text");
        defaultOption.style.fontWeight = "bold";
        defaultOption.style.backgroundColor = "rgba(114, 208, 255, 0.17)"
        selectedOptions[control.id] = defaultOption;
        control.addEventListener("click", toggleBoldnessAndAction);
    });
});


// !! Logic for dynamic information handling
// Sample data representing user-selected configuration
const pointData = {
    stop: "A",
    delay: "180",
    latitude: 40.7128, // Example latitude
    longitude: -74.0060 // Example longitude
};

// Function to create and append list items to the console-information div
function createConsoleInformation() {
    const consoleInformationDiv = document.getElementById("console-information");
    
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
    sampleText.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua sed do eiusmod tempor incididunt ut labore et dolore magna aliqua sed do eiusmod tempor incididunt ut labore et dolore magna aliqua sed do eiusmod tempor incididunt ut labore et dolore magna aliqua sed do eiusmod tempor incididunt ut labore et dolore magna aliqua sed do eiusmod tempor incididunt ut labore et dolore magna aliqua sed do eiusmod tempor incididunt ut labore et dolore magna aliqua sed do eiusmod tempor incididunt ut labore et dolore magna aliqua";
    
    // Append the unordered list to the console-information div
    consoleInformationDiv.appendChild(ul);
    consoleInformationDiv.appendChild(sampleText);

    // Append Google Maps Street View iframe
    const iframe = document.createElement("iframe");
    iframe.setAttribute("width", "100%");
    iframe.setAttribute("height", "200");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("style", "border:0; border-radius: 1rem; padding: 1rem 0");
    iframe.setAttribute("src", `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=${pointData.latitude},${pointData.longitude}`);
    
    consoleInformationDiv.appendChild(iframe);
}

// Call the function to create console information initially
createConsoleInformation();