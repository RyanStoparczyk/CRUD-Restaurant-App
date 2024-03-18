const Restaurant = require('../models/RestaurantModel');

/* 
  /restaurants GET Request
  Content Types:   Response:
  HTML            -Return the HTML page with links to each restaurant.
  JSON            -Return an object {restaurants | [restaurant._id]}.
*/
exports.queryParser = (req,res,next) => {
  const MAX_RESTAURANTS = 50;

  let params = [];

  for(prop in req.query) {
    if(prop == 'page') {
      continue;
    }
    params.push(prop + '=' + req.query[prop]);
  }
  req.qstring = params.join('&');

  try {
    req.query.limit = +req.query.limit || 10;
    if(req.query.limit > MAX_RESTAURANTS) {
      req.query.limit = MAX_RESTAURANTS;
    }
  } catch {
    req.query.limit = 10;
  }

  try {
    req.query.page = +req.query.page || 1;
    if(req.query.page < 1) {
      req.query.page = 1;
    }
  } catch {
    req.query.page = 1;
  }
  next();
}

exports.loadRestaurants = (req,res,next) => {
  let startIndex = ((req.query.page-1) * req.query.limit);
  let amount = req.query.limit;

  Restaurant.find()
  .limit(amount)
  .skip(startIndex)
  .then((results) => {
    res.restaurants = results;
    next();
    return;
  })
  .catch((err) => {
    res.status(500).send('Error reading activities.');
    console.log(err);
    return;
  });
}

exports.respondRestaurants = (req, res, next) => {
  let restaurant_cache = res.restaurants;
  res.format({
    'text/html': () => { 
      res.render('restaurants-list', {restaurant_cache})
    },
    'application/json': () => {
      let index_list = [];
      for(let i = 0; i < restaurant_cache.length; i++) {
        index_list.push(restaurant_cache[i]._id)
      }
      res.status(200).json({restaurants: index_list})
    }
  });
  console.log('GET request successful');
}

/*
Request Accepts a JSON object:
  Response and Request Content Type: application/json
  Response: created Restaurant document.
*/
exports.createRestaurant = (req, res, next) => {
  let newRestaurant = new Restaurant();
  newRestaurant.name          = req.body.name;
  newRestaurant.delivery_fee  = +req.body.delivery_fee;
  newRestaurant.min_order     = +req.body.min_order;

  newRestaurant.save()
  .then(function (){
    res.status(201).json(newRestaurant);
  })
  .catch((err) => {
    res.status(500).send(err.message);
    console.log(err);
    return;
  })
}

/*
  /restaurants/:restID GET Request
  Content Types:  Response:
  JSON           -Returns the entire restaurant object with the given id
  HTML           -Returns an HTML page
*/

exports.loadSingleRestaurant = (req, res, next, value) => {
  Restaurant.findById(value)
  .then((result) => {
    if(!result) {
      res.status(404).send(`Activity ID ${value} does not exist.`)
      return;
    }
    req.restaurant = result;
    next();
    return;
  })
  .catch((err) => {
    res.status(500).send('Error reading activity.');
    console.log(err);
    return;
  })
}

exports.sendSingleRestaurant = (req, res, next) => {
  let restaurant = req.restaurant
  res.format({
    'application/json': () => {
      res.status(200).json(restaurant);
    },
    'text/html': () => {
      res.render('restaurant-page.pug', {restaurant})
    }
  })
}

/*
  PUT /restaurants/:restID
  Accepts a JSON object.
  Response: 
  - 500 if there were errors with the update
  - Responds with the updated object if the changes have been made.
*/
exports.modifyRestaurant = (req, res, next) => {
  delete req.body._id;
  req.restaurant = Object.assign(req.restaurant, req.body);
  req.restaurant.save()
  .then((result) => {
    res.status(200).json(result);
    return;
  })
  .catch((err) => {
    res.status(500).send('Error updating restaurant.');
    console.log(err);
    return;
  })
}

/*
  DELETE /restaurants/:restID
  Response: 
  - 500 if there were errors with the delete 
  - 200 response if the changes have been made.
*/
exports.deleteRestaurant = (req, res, next) => {
  Restaurant.findByIdAndDelete(req.restaurant._id)
  .then((result) => {
    res.status(200).json(result);
    console.log(`Successfully deleted restaurant ${result._id}`)
  })
  .catch((err) => {
    res.status(500).send('Error deleting activity');
    console.log(err);
    return;
  });
}