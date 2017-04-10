const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: false },
}));

app.use('/', express.static(`${__dirname}/../public/`));
app.get('/credentials', (request, response) => {
  response.json({
    current_user: request.session.user,
    credentials: {
      client_id: process.env.CLIENT_ID || null,
      scope: process.env.SCOPE || null,
    },
  });
});

app.post('/signin', (request, response) => {
  request.session.user = request.body;
  response.send({ message: 'Successfully saved the session' });
});

app.post('/signout', (request, response) => {
  request.session.destroy();
  response.send({ message: 'Successfully destroyed the session' });
});

app.listen(port, console.log(`Currently listening on port: ${port}`));

module.exports = app;
