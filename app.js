/* Table of Contents:
- Establishing our required nodes and variables
- GET /
- Server initialization
*/

//establish apps
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
let app = express();
const port = process.env.PORT || 3000;
const pug = require('pug');

//set up paths
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//set the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views/pages'));

//set up the routers
const restRoute = require('./src/routers/Restaurants');
app.use('/restaurants', restRoute);

app.get('/', (req, res, next) => { 
  res.render('index.pug') 
});

app.get('/addrestaurant', (req, res, next) => {
  res.render('add-restaurant.pug');
});

mongoose.connect('mongodb+srv://databaseryan:AVF3X6SWFwrzrlFc@menumaker.wezyc0h.mongodb.net/restaurants');
let db = mongoose.connection;

db.on('error', console.error.bind(console,'connection error:'));
db.once('open', function(){ 
  console.log('Connected to restaurants database.');

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});


