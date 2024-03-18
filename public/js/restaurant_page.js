//locally saved restaurant
let cached_rest = {};

/*
  GET /restaurants/:restID
  res.data is the JSON object of the current restaurant.
  This gets stored locally for the user to modify.

  followed by a function to randomly set the background.
*/
async function init() {
  let url = window.location.href;
  let sliceIndex = (url.lastIndexOf('/') + 1);
  let rest_id = url.slice(sliceIndex);
  try {
    console.log(`Making GET request to restaurants/${rest_id}`);
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
  document.getElementById('restaurant-info')
  .setAttribute('style', 
  `background-image: linear-gradient(rgba(0,0,0,0.75),rgba(0, 0, 0, 0.75)),
    url('https://source.unsplash.com/collection/552014/100vwx16vh?${Math.random()}`);
}

/* 
  DELETE /restaurants/:restID
  Purpose: delete the current restaurant from the cache on the server-side.
*/
async function deleteHandler() {
  if (confirm('Are you sure you want to close this restaurant forever?')) {
    console.log(`Making DELETE request to restaurants/${cached_rest._id}`);
  } else {
    console.log(`${cached_rest.name} continues to live another day.`);
    return;
  }
  try {
    const res = await axios.delete(`http://localhost:3000/restaurants/${cached_rest._id}`);
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
    console.log(`Making PUT request to restaurants/${cached_rest._id}`);
    const res = await axios
      .put(`http://localhost:3000/restaurants/${cached_rest._id}`, {
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
  Responds to 'add category' button press.
  Validates data.
  Updates local copy of restaurant.
  Updates on DOM.
*/
function categoryAdder() {
  let newCategory = document.getElementById('category').value;
  textboxWiper();
  let non_unique = Number.isInteger(categoryIndex(newCategory));
  if (newCategory === '' || non_unique) {
    alert('Please input a (unique) name for your new category.');
    return;
  }
  cached_rest.menu.push({category: newCategory, items: []});
  categoryRefresher(newCategory);
}

/*
  Handles the flow of 'add item' button press
  Checks the validity of the data with a call to domItemReader.
*/
function itemAdder() {
  console.log('Add menu item request has been made.');
  let new_item = itemReader();
  if (new_item != 0) {
    let index = categoryIndex(new_item.category);
    let categoryObj = cached_rest.menu[index];

    categoryObj.items.push(new_item.menu_item);
    let itemIndex = (categoryObj.items.length - 1);
    menuRefresher(index, itemIndex);
    console.log('Menu item added.');
  } else {
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
function infoUpdater() {
  console.log('Modify request has been made.');
  let new_info = infoReader();

  if (new_info.name != '') {
    cached_rest.name = new_info.name;
    document.title = new_info.name;
    console.log('Name updated to: ' + new_info.name);
  }
  if (new_info.delivery_fee) {
    cached_rest.delivery_fee = new_info.delivery_fee;
    console.log('Delivery fee updated to: ' + new_info.delivery_fee);
  }
  if (new_info.min_order) {
    cached_rest.min_order = new_info.min_order;
    console.log('Minimum Order updated to: ' + new_info.min_order);
  }
  infoRefresher();
}

function categoryIndex(category){
  for(let i = 0; i < cached_rest.menu.length; i++){
    if(cached_rest.menu[i].category === category){
      return i;
    }
  }
  console.log('Category not found');
  return false;
}