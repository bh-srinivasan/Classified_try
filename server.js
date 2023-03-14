// Define express and path variables
const express = require('express');
const path = require('path');

// Create a variable for Route where different items can be routed
const cookieSession = require('cookie-session');

// Define Error Catching
const createError = require('http-errors');

// Import Body-parser
const bodyParser = require('body-parser');

// Import CategoryService js
const CategoryService = require('./services/CategoryService');

// Call constructors of CategoryService
const categoryService = new CategoryService(path.join(__dirname, 'data', 'categories.json'));
console.log(categoryService);

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
app.locals.appName= 'Together Mart';

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

// Set Global Variables
app.locals.siteName = 'Together Mart';

// Routes
app.use('/', routes({ categoryService }));

// Middleware to handle "File not found" errors
 app.use((request, response, next) => {
  next(createError(404, 'File not found'));
}); 

// Error handling middleware
app.use((err, req, res) => {
  // Set the error status and message
  res.status(err.status || 500);
  res.locals.error = err.message;
  res.locals.errorStatus = err.status;

  // Set the error stack trace (if available)
  res.locals.errorStack = err.stack || '';

  // If the error is a 404, set the message to be more specific
  if (err.status === 404) {
    res.locals.error = `The requested file '${req.originalUrl}' could not be found`;
  }

  // If the error is a CSS parsing error, add more details to the error message
  if (err.name === 'CssSyntaxError') {
    res.locals.error += `\n\nError in file '${err.filename}', line ${err.line}, column ${err.column}:\n${err.reason}`;
  }

  // If the error is a rendering error, add more details to the error message
  if (err.view) {
    res.locals.error += `\n\nError rendering '${err.view}'`;
  }

  // Log the error to the console
  console.error(err);

  // Render the error page
  res.render('error');
});


app.listen(port, () => {
  console.log(`Express server listening on port ${port}!`);
});