const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const bodyParser = require('body-parser');

const routes = require('./routes/index');

const CategoryService = require('./services/CategoryService');

const categoryService = new CategoryService(
  path.join(__dirname, 'data', 'categories.json')
);

const app = express();
const port = 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'static')));
app.set('trust proxy', 1);
app.locals.appName = 'Together Mart';

app.use((req, res, next) => {
  res.locals.homeVar = 'Home';
  next();
});

app.use(
  cookieSession({
    name: 'session',
    keys: ['ABC', 'DEF'],
    maxAge: 1 * 60 * 60 * 1000,
    sameSite: 'none',
    secure: false,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes({ categoryService }));

app.use((req, res, next) => {
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
