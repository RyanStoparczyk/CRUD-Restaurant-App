const fs = require('fs');
let restaurant_cache = {};

/* 
  /restaurants GET Request
  Content Types:   Response:
  HTML            -Return the HTML page with links to each restaurant.
  JSON            -Return an object with the key 'restaurants'. The value is a list of restaurant ids.
*/
exports.getRest = (req, res, next) => {
  console.log('GET request received for /restaurants');
  if (req.accepts('text/html')) {
    // if the request is for html
    res.render('restaurants-list', { restaurant_cache }); // then serve the html page
  } else if (req.accepts('application/json')) {
    // if the request is for json
    // init variable for the list of ids.
    let index_list = [];
    Object.keys(restaurant_cache) // for each restaurant stored
      .forEach(
        (
          key, // iterate through
        ) => index_list.push(restaurant_cache[key].id), // and push the id onto the index_list
      );

    res
      .setHeader('Content-Type', 'application/json') // set the Content-Type
      .status(200) // set status as 200 (OK)
      .send(JSON.stringify({ restaurants: index_list })); // return object
    console.log('GET request successful');
  }
};

/* 
  /restaurants POST request
  Request Accepts a JSON object: {"name": string, "delivery_fee": int, "min_order": int}
  Response and Request Content Type: application/json
  Logic: Must confirm that the correct fields exist in the body of the object. Adds an empty menu and a unique ID 
  Response: {"id": int, "name": string, "delivery_fee": int, "min_order": int, "menu": {}}
*/
exports.postRest = (req, res, next) => {
  console.log('POST request received');
  if (
    // validates data types
    !(
      typeof req.body.name === 'string' &&
      req.body.name != '' &&
      typeof req.body.delivery_fee === 'number' &&
      typeof req.body.min_order === 'number'
    )
  ) {
    res.status(400).send('Invalid Restaurant Data Type(s)');
    console.log('POST request unsuccessful');
  } else {
    let new_id = idCreator();
    // The data types are valid. Therefore we must create a new object, with a unique id and an empty menu.
    let new_restaurant = {
      id: new_id,
      name: req.body.name,
      delivery_fee: req.body.delivery_fee,
      min_order: req.body.min_order,
      menu: {},
    };
    //add new object to the restaurant cache
    restaurant_cache[new_id] = new_restaurant;
    //Send status, and new JSON object.
    res.status(200).send(JSON.stringify(new_restaurant));
    console.log('POST request successful');
  }
};

/*
  /restaurants/:restID GET Request
  Content Types:  Response:
  JSON           -Returns the entire restaurant object with the given id
  HTML           -Returns an HTML page
*/
exports.getRestID = (req, res, next) => {
  console.log('GET request received for restID:', req.params.restID);
  let idCheck = idChecker(+req.params.restID);
  //error state
  if (idCheck === false) {
    res.status(404).send('Restaurant with matching ID not found.');
    console.log('GET request unsuccessful.');
  } else {
    let restaurant = restaurant_cache[req.params.restID];
    //HTML requested.
    if (req.accepts('text/html')) {
      res.render('restaurant-page.pug', { restaurant });
    }
    //JSON requested
    else if (req.accepts('application/json')) {
      res.status(200).send(JSON.stringify(restaurant));
      console.log('GET request successful.');
    }
  }
};

/*
  PUT /restaurants/:restID
  Accepts a JSON object. The assignment assumes that the request follows proper data structure. (no verification)
  Logic: the server accepts this object, and updates the server's restaurant cache.
  Returns: 
  - 404 if restID not found
  - Responds with the updated object if the changes have been made.
*/
exports.putRestID = (req, res, next) => {
  console.log('PUT request received for restID:', req.params.restID);
  //error state
  if (idChecker(+req.params.restID) === false) {
    res.status(404).send('Restaurant with matching ID not found.');
    console.log('PUT request unsuccessful.');
  } else {
    //update the server's restaurant_cache
    restaurant_cache[req.params.restID] = req.body;
    res.status(200).send(restaurant_cache[req.params.restID]);
    console.log('PUT request successful.');
  }
};
/*
  DELETE /restaurants/:restID
  Logic: the server deletes the requested restaurant from the restaurant cache.
  Returns: 
  - 404 if restID not found
  - '' response if the changes have been made.
*/
exports.delRestID = (req, res, next) => {
  console.log('DELETE request received for restID:', req.params.restID);
  //error state
  if (idChecker(+req.params.restID) === false) {
    res.status(404).send('Restaurant with matching ID not found.');
    console.log('DELETE request unsuccessful.');
  } else {
    //update the server's restaurant_cache
    delete restaurant_cache[req.params.restID];
    res.status(200).send('');
    console.log('DELETE request successful');
  }
};

//helper function that creates a new unique id for a restaurant
function idCreator() {
  let rest_ids = Object.keys(restaurant_cache);
  let new_id = 0;
  while (idChecker(new_id)) {
    rest_ids.forEach((key, index) => {
      if (new_id === +key) {
        new_id++;
      }
    });
  }
  console.log('New id created:', new_id);
  return new_id;
}

//helper function that checks to see if a restaurant exists with that id
function idChecker(id) {
  let rest_ids = Object.keys(restaurant_cache);
  let bool = false;
  console.log('Checking ID');
  rest_ids.forEach((key, index) => {
    if (id === +key) {
      bool = true;
      console.log('Found.');
    }
  });
  if (bool === false) {
    console.log('Not Found.');
  }
  return bool;
}

//Initializing the restaurant cache
fs.readdir('./data', (err, files) => {
  if (err) return console.log(err); //Throws ERR if no file directory exists
  let restaurant;
  for (let i = 0; i < files.length; i++) {
    if (files[i].endsWith('.json')) {
      restaurant = require('../../data/' + files[i]);
      restaurant_cache[restaurant.id] = restaurant;
    }
  }
  console.log('Restaurant cache loaded.');
});
