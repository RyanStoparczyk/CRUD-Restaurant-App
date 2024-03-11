/* 
  TABLE OF CONTENTS:
  Handlers: async
    -init() - GET /restaurants/:restID
    -updateHandler() - PUT /restaurants/:restID
    -deleteHandler() - DELETE /restaurants/:restID
  Handlers: synchronous
    -addCategoryHandler()
    -addItemHandler()
    -modRestHandler()
  Helpers: DOM-Manipulating
  Helpers: Misc.
*/

//locally saved restaurant
let cached_rest = {};

/*
---------------------------------
HANDLERS: ASYNC
---------------------------------
*/

/* 
  GET /restaurants/:restID
  Only accepts JSON objects.
  res.data is the JSON object of the current restaurant.
  This gets stored locally for the user to modify.
*/
async function init(rest_id) {
  try {
    console.log(`Making GET request to restaurants/${cached_rest.id}`);
    const res = await axios.get(`http://localhost:3000/restaurants/${rest_id}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    cached_rest = res.data;
    console.log('Successful GET request. Restaurant cached.');
  } catch (err) {
    console.log(err);
  }
}

/* 
  DELETE /restaurants/:restID
  Purpose: delete the current restaurant from the cache on the server-side.
*/
async function deleteHandler() {
  if (confirm('Are you sure you want to close this restaurant forever?')) {
    console.log(`Making DELETE request to restaurants/${cached_rest.id}`);
  } else {
    console.log(`${cached_rest.name} continues to live another day.`);
    return;
  }
  try {
    const res = await axios.delete(`http://localhost:3000/restaurants/${cached_rest.id}`);
    console.log('Successful DELETE request. Restaurant closed.');
    window.location.replace('http://localhost:3000/restaurants');
  } catch {
    console.log(err);
  }
}

/* 
  PUT /restaurants/:restID
  Purpose: sends cached restaurant to be saved on the server-side.
  Req.body is cached_rest broken down into an object.
  Res.data is the new representation of the restaurant on the server-side.
*/
async function updateHandler() {
  try {
    console.log(`Making PUT request to restaurants/${cached_rest.id}`);
    const res = await axios
      .put(`http://localhost:3000/restaurants/${cached_rest.id}`, {
        id: cached_rest.id,
        name: cached_rest.name,
        min_order: cached_rest.min_order,
        delivery_fee: cached_rest.delivery_fee,
        menu: cached_rest.menu,
      })
      .then((res) => console.log(res.data));
  } catch {
    console.log(err);
  }
}

/*
---------------------------------
HANDLERS: SYNCHRONOUS
---------------------------------
*/

/*
  Responds to 'add category' button press.
  Validates data.
  Updates local copy of restaurant.
  Updates on DOM.
*/
function addCategoryHandler() {
  let newCategory = document.getElementById('category').value;
  refreshTextboxes();

  if (newCategory === '' || cached_rest.menu[newCategory]) {
    alert('Please input a (unique) name for your new category.');
    return;
  }
  cached_rest.menu[newCategory] = {};
  addCategoryToDOM(newCategory);
}

/*
  Handles the flow of 'add item' button press
  Checkes the validity of the data with a call to domItemReader.
*/
function addItemHandler() {
  console.log('Add menu item request has been made.');

  let domItems = domItemReader(); //returns obj if valid, returns 0 if err

  //clear the textboxes
  refreshTextboxes();

  if (domItems != 0) {
    //if data is valid
    //call to idCreator() to create a unique id for the menu item
    let new_id = idCreator();
    console.log(new_id);

    //adds new menu item to the local restaurant object
    cached_rest.menu[domItems.new_item_category][new_id] = domItems.new_menu_item;

    console.log('Menu item added.');
    console.log(cached_rest.menu[domItems.new_item_category][new_id]);

    //update the DOM with the new item.
    refreshMenuView(domItems.new_item_category, new_id);
  } else {
    //if data is invalid
    alert('Please fill every prompt. Ensure that price is a number.');
    return;
  }
}

/* 
  Handles update restaurant info button
  vars: name, delivery_fee, min_order
  reads vars from DOM & checks validity
  updates DOM if valid data
  alerts user if the data is invalid
*/
function modRestInfo() {
  console.log('Modify request has been made.');

  let new_name = document.getElementById('name').value;
  let new_delivery_fee = +document.getElementById('delivery_fee').value;
  let new_min_order = +document.getElementById('min_order').value;

  //clear the textboxes
  refreshTextboxes();

  //if restaurant name was modified
  if (new_name != '') {
    cached_rest.name = new_name;
    document.title = new_name;
    console.log('Name updated to: ' + new_name);
  }

  //if delivery fee was modified
  if (new_delivery_fee) {
    cached_rest.delivery_fee = new_delivery_fee;
    console.log('Delivery fee updated to: ' + new_delivery_fee);
  }

  //if the minimum order amount was modified.
  if (new_min_order) {
    cached_rest.min_order = new_min_order;
    console.log('Minimum Order updated to: ' + new_min_order);
  }
  refreshRestaurantInfo();
}

/*  
  ---------------------------------
  HELPER FUNCTIONS: DOM-MANIPULATING
  ---------------------------------
*/

/* 
  Helper function for addCategoryHandler.
  Appends child nodes to DOM in three locations.
  The first is the table of contents list.
  The second is the menu list.
  The third is the category selector for the addItemHandler()
  
*/
function addCategoryToDOM(newCategory) {
  //PART 1: add new category to table of contents list
  let catLinkNode = document.createElement('a');
  let linkTextNode = document.createElement('STRONG');
  let brNode0 = document.createElement('br');
  let brNode1 = document.createElement('br');

  catLinkNode.href = `#${newCategory.replace(' ', '_')}`;
  linkTextNode.innerHTML = `${newCategory}`;
  catLinkNode.append(linkTextNode, brNode0, brNode1);

  document.getElementById('category_links').append(catLinkNode);

  //PART 2: add new category to the menu.
  let catMenuDivNode = document.createElement('div');
  let catMenuHeadNode = document.createElement('h3');

  catMenuDivNode.id = `${newCategory.replace(' ', '_')}`;
  catMenuHeadNode.innerText = `${newCategory}`;
  catMenuDivNode.append(catMenuHeadNode);

  document.getElementById('itemized_menu').append(catMenuDivNode);

  //Part 3: add new category to the options list
  let catSelectNode = document.createElement('option');

  catSelectNode.value = newCategory;
  catSelectNode.innerText = newCategory;

  document.getElementById('categories_select').append(catSelectNode);
}

/* 
  Helper function called by addMenuItemHandler()
  Reconstructs the dom menu of the specified category with local information.
*/
function refreshMenuView(category, itemID) {
  let foodItem = cached_rest.menu[category][itemID];
  category = category.replace(' ', '_');
  let domMenu = document.getElementById(category);

  //create nodes for append
  let idNode = document.createElement('p');
  let nameNode = document.createElement('p');
  let descNode = document.createElement('p');
  let priceNode = document.createElement('p');
  let brNode = document.createElement('br');

  //change innerHTML of each node
  idNode.innerHTML = `ID: ${itemID}`;
  nameNode.innerHTML = `${foodItem.name}`;
  descNode.innerHTML = `${foodItem.description}`;
  priceNode.innerHTML = `$${Number(foodItem.price).toFixed(2)}`;

  //append nodes to the menu
  domMenu.append(idNode, nameNode, descNode, priceNode, brNode);
}

//updates the view for the restaurant info field.
function refreshRestaurantInfo() {
  console.log('Updating menu.');
  document.getElementById('res_name').innerHTML = cached_rest.name;
  document.getElementById('res_fee').innerHTML =
    `Delivery Fee: $${Number(cached_rest.delivery_fee).toFixed(2)} | ` +
    `Minimum Order: $${Number(cached_rest.min_order).toFixed(2)}`;
}

/*
  Helper function that clears all textboxes. 
*/
function refreshTextboxes() {
  //reset text fields.
  let reset_fields = document.getElementsByClassName('resetme');
  for (let i = 0; i < reset_fields.length; i++) {
    reset_fields[i].value = '';
  }
}

/*  
  ---------------------------------
  HELPER FUNCTIONS: MISC.
  ---------------------------------
*/

/* 
  Helper function for localaddItemHandler()
  Reads the DOM and returns category info, and a (name, desc, and price) object.
*/
function domItemReader() {
  // read from DOM
  let new_item_name = document.getElementById('menu_item').value;
  let new_item_category = document.getElementById('categories_select').value;
  let new_item_desc = document.getElementById('menu_item_description').value;
  let new_item_price = +document.getElementById('menu_item_price').value;

  // validate data
  if (new_item_name != '' && new_item_category != '' && new_item_desc != '' && new_item_price) {
    // make object from values
    let new_menu_item = {
      name: new_item_name,
      description: new_item_desc,
      price: new_item_price,
    };
    return { new_item_category, new_menu_item };
  } else {
    return 0;
  }
}

/* 
  Helper function for localAddItem()
  Purpose: iterates through the categories of the menu to count the length of each. 
    The final length then becomes the new id for the menu item.
  Returns the new id
*/
function idCreator() {
  let categories = Object.keys(cached_rest.menu);
  let new_id = 0;
  categories.forEach((key, index) => {
    new_id += Object.keys(cached_rest.menu[key]).length;
  });
  return new_id;
}
