const express = require("express");
const { createClient } = require("redis");

const app = express();
const client = createClient(6379, "redis-server");
client.set("visits", 1);

app.get("/", (request, response) => {
    client.get("visits", (error, visits) => {
        if (error) { response.send("Error: " + error); }
        else {
            client.set("visits", parseInt(visits) + 1);
            response.send("Number of visits: " + visits);
        }
    });
});

app.listen(8081, () => {
    console.log("Server is running on port 8081...");
});