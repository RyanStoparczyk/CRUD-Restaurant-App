/* Table of Contents:
- Establishing our required nodes and variables
- GET /
- Server initialization
*/

//establish apps
const path = require('path');
const express = require('express');
let app = express();
const PORT = 3000;
const pug = require('pug');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//set the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//set up the routers
const restRoute = require('./routers/Restaurants');
app.use('/restaurants', restRoute);

/*
  Get '/'
  Content Type: HTML
  Response: HTML homepage.
*/
app.get('/', (req, res, next) => {
  res.render('index.pug');
});

/* 
  /addrestaurant GET Request
  Content Type: HTML
  Response: HTML page with a form to submit a POST request to /restaurants
*/
app.get('/addrestaurant', (req, res, next) => {
  res.render('add-restaurant.pug');
});

const server = app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  debug('SIGINT signal received: closing HTTP server');
  server.close(() => {
    debug('HTTP server closed');
  });
});
