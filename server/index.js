const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use('/', express.static(`${__dirname}/../public/`));
app.get('/credentials', (request, response) => {
  const credentials = {
    client_id: process.env.CLIENT_ID || null,
    scope: process.env.SCOPE || null,
  };
  response.json(credentials);
});

app.listen(port, console.log(`Currently listening on port: ${port}`));

module.exports = app;
