const bysykkel = require("./public/js/bysykkel-client");
const express = require('express');


if (!process.env.API_KEY) {
    console.error("Du må kjøre applikasjonen med API_KEY miljøvariabel, f.eks: API_KEY=xxx node server.js");
    process.exit(1);
}

const fetchData = bysykkel.createClient(process.env.API_KEY);

// Proxy for bysykkel api-et som ikke har CORS
const proxyEndpoint = (req, res) => {
    fetchData()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            console.error("ERROR: ", err);
            res.status(504).send({error: 'Prøv igjen senere'});
        });
};

// Sett opp express
const app = express();
app.use(express.static('public'));
app.get('/proxy/stations', proxyEndpoint);

app.listen(3000, () => {
    console.log("Yey! Bysykkel app is up and running at:");
    console.log('http://localhost:3000/');
});
