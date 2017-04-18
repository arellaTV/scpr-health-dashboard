const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 8080;
const saltRounds = 10;

const globalUsername = process.env.USERNAME || null;
const globalPassword = process.env.PASSWORD || null;
let globalHash = null;

bcrypt.genSalt(saltRounds, (err, salt) => {
  bcrypt.hash(globalPassword, salt, (err, hash) => {
    globalHash = hash;
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: false },
}));

app.use((request, response, next) => {
  if (request.session.signedIn === undefined) {
    request.session.signedIn = false;
  }
  next();
});

app.use('/', express.static(`${__dirname}/../public/`));
app.get('/credentials', (request, response) => {
  response.json({
    current_user: request.session.user,
    credentials: {
      client_id: process.env.CLIENT_ID || null,
    },
    signedIn: request.session.signedIn,
  });
});

app.post('/signin', (request, response) => {
  const usernameAttempt = request.body.username;
  const passwordAttempt = request.body.password;

  bcrypt.compare(passwordAttempt, globalHash, (error, result) => {
    if (result && usernameAttempt === globalUsername) {
      request.session.signedIn = true;
      response.json({ message: 'Sign in has succeeded', signedIn: true });
    } else {
      response.json({ message: 'Sign in has failed', signedIn: false });
    }
  });
});

app.post('/signout', (request, response) => {
  request.session.destroy();
  response.send({ message: 'Successfully destroyed the session' });
});

app.listen(port, console.log(`Currently listening on port: ${port}`));

module.exports = app;
