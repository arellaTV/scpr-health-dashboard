const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const charts = require('./data/charts.js') || [];

app.use('/', express.static(`${__dirname}/../public/`));
app.get('/charts', (request, response) => {
  response.json(charts);
});

app.listen(port, console.log(`Currently listening on port: ${port}`));