const express = require('express');

if (!process.env.API_KEY) {
   console.error("Du må kjøre applikasjonen med API_KEY miljøvariabel, f.eks: API_KEY=xxx node server.js");
   process.exit(1);
}

const app = express();

app.use(express.static('public'));
app.listen(3000, () => console.log('Example app listening on port 3000!'));
