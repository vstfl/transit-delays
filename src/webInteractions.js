window.onload = function () {
    let mapTitle = "Person-Minute Delays at Each Neighborhood"; // Dynamically changed later
    setConsoleText("map-title", mapTitle);

    let mapInfo =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proi ";
    setConsoleText("map-information", mapInfo);
};

function setConsoleText(id, text) {
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
                selectedOption.style.fontWeight = "normal"; // Deselect previously selected option
            }
            target.style.fontWeight = "bold"; // Select the clicked option
            selectedOptions[control.id] = target; // Update the selected option

            console.log(`Selected ${target.textContent}`);
            // TODO: Add function here to load the specific data, and change console texts
        }
    }

    // Add event listeners for all interactive-form controls
    controls.forEach(function (control) {
        const defaultOption = control.querySelector(".interactive-text");
        defaultOption.style.fontWeight = "bold";
        selectedOptions[control.id] = defaultOption;
        control.addEventListener("click", toggleBoldnessAndAction);
    });
});
