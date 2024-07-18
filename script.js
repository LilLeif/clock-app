document.addEventListener("DOMContentLoaded", () => {
    let timeOffset = null;
    const dropDown = document.getElementById("dropdown");
    const mainHeading = document.getElementById("main-heading");
    const clock = document.getElementById("clock");

    // Function to fetch data from the proxy server API
    async function getAPI(requestedZone) {
        try {
            const response = await fetch(`http://localhost:3000/api/timezone/${requestedZone}`); // Fetching data from the proxy server
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("There was an error: " + error);
            return null; // Ensure null is returned on error
        }
    }

    // Function to update the clock display
    function updateClock() {
        const currentTime = new Date();
        const localTime = new Date(currentTime.getTime() + timeOffset); // Adding the offset to the current time
        const hours = String(localTime.getUTCHours()).padStart(2, "0"); // Correct method name and padding hours
        const minutes = String(localTime.getUTCMinutes()).padStart(2, "0"); // Correct method name and padding minutes
        const seconds = String(localTime.getUTCSeconds()).padStart(2, "0"); // Correct method name and padding seconds
        
        clock.textContent = `${hours}:${minutes}:${seconds}`; // Updating the clock element's text
    }

    // Function to calculate the time offset
    function getTimeOffset(data) {
        const currentTime = new Date();
        const apiOffsetMillis = (data.hour * 3600 + data.minute * 60 + data.seconds) * 1000; // Converting API time to milliseconds
        const utcHours = currentTime.getUTCHours(); // Correct method name
        const utcMinutes = currentTime.getUTCMinutes(); // Correct method name
        const utcSeconds = currentTime.getUTCSeconds(); // Correct method name

        const currentUTCTimeMillis = (utcHours * 3600 + utcMinutes * 60 + utcSeconds) * 1000; // Current UTC time in milliseconds
        return apiOffsetMillis - currentUTCTimeMillis; // Calculating the offset
    }

    // Function to set up the clock
    async function setupClock() {
        const dropDownValue = dropDown.value; // Get selected timezone value
        console.log(dropDownValue);
        const data = await getAPI(dropDownValue); // Fetching the API data
        console.log("API response: " + data);

        if (data) {
            timeOffset = getTimeOffset(data); // Calculating the time offset
            console.log("Time offset: " + timeOffset);
            mainHeading.textContent = dropDown.options[dropDown.selectedIndex].textContent; // Updating the main heading
            updateClock(); // Initial clock update
            setInterval(updateClock, 1000); // Setting interval to update clock every second
        } else {
            clock.textContent = "TIMEZONE UNAVAILABLE"; // Handling unavailable timezone
        }
    }

    dropDown.addEventListener('change', setupClock); // Adding event listener to the dropdown

    setupClock(); // Initial setup call
});