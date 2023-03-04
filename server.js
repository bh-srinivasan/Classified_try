// Define express and path variables
const express = require('express');
const path = require('path');

// Create a variable for Route where different items can be routed
const cookieSession = require('cookie-session');

// Define Error Catching
const createError = require('http-errors');

// Import Body-parser
const bodyParser = require('body-parser');


const routes = require('./routes/index');



// Create an instance for Express
const app = express();

// Create a port where we can listen
const port = 3001;

// Setting express template and views path
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'static')));

app.set('trust proxy', 1);

// Set Global Variables
app.locals.siteName = 'TogetherMart';

// Set Variables for Home Page in response
app.use((request, response, next) => {
  response.locals.homeVar = 'Home';
  next();
});


// Setup Cookies
app.use(
  cookieSession({
    name: 'session',
    keys: ['Bhar123212', 'Vidh123212'],
    maxAge: 1 * 60 * 60 * 1000, // 24 hours
  })
);

// Setup BodyParser
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());


// Routes
app.use('/', routes());

// Middleware to handle "File not found" errors
app.use((request, response, next) => {
  next(createError(404, 'File not found'));
});

// Error handling middleware
app.use((err, request, response) => {
  response.locals.message = err.message;
  console.error(err);
  const status = err.status || 500;
  response.locals.status = status;
  response.status(status);
  response.render('error');
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}!`);
});
