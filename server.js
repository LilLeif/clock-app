const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors")

app.use(cors())

app.use(express.json())

app.get("/api/timezone/:continent/:city", async (req, res) => {
    const { continent, city } = req.params; // Extracting the continent and city parameters
    const timeZone = `${continent}/${city}`;
    console.log(`https://www.timeapi.io/api/Time/current/zone?timeZone=${timeZone}`); // Logging the request URL
    try {
        const fetch = await import("node-fetch");
        const response = await fetch.default(`https://www.timeapi.io/api/Time/current/zone?timeZone=${timeZone}`); // Fetching data from the time API
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // Handling HTTP errors
        }
        const data = await response.json();
        res.json(data); // Sending the API data as response
    } catch (error) {
        console.error("There was an error: " + error);
        res.status(500).json({ error: "Failed to fetch data" }); // Handling fetch errors
    }
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`); // Starting the server
});
