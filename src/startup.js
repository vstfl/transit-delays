document.getElementById("loadingScreen").style.opacity = 1;
window.addEventListener("load", function () {
    setTimeout(function () {
        // Gradually increase the opacity of elements with class "loadup" to reveal the content
        let elements = document.querySelectorAll(".loadup");
        let opacity = 0;
        const increment = 0.02; // Adjust the increment value as needed for smoother or faster transitions
        const duration = 500; // Adjust the duration for smoother or faster transitions

        // Function to increase opacity of an element
        function increaseOpacity(element) {
            return new Promise((resolve) => {
                let currentOpacity = 0;
                const intervalId = setInterval(function () {
                    currentOpacity += increment;
                    element.style.opacity = Math.min(currentOpacity, 1); // Ensure opacity doesn't exceed 1
                    if (currentOpacity >= 1) {
                        clearInterval(intervalId); // Stop increasing opacity when it reaches 1
                        resolve(); // Resolve the Promise
                    }
                }, duration * increment); // Adjust the interval duration as needed for smoother or faster transitions
            });
        }

        // Execute the animation for each element sequentially
        async function animateElements() {
            for (let element of elements) {
                await increaseOpacity(element);
            }
        }

        // Start the animation
        animateElements().then(() => {
            // Hide the loading screen after all animations are complete
            document.getElementById("loadingScreen").style.display = "none";
        });
    }, 500);
});
